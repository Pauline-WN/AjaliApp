from flask import Flask, request, jsonify, session, send_from_directory
from flask_restful import Api, Resource
from flask_migrate import Migrate
from flask_cors import CORS
from models.extensions import db
from models.user import User
from models.incident_report import IncidentReport
from models.incident_image import IncidentImage
from models.incident_video import IncidentVideo
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from functools import wraps
from datetime import timedelta
import os

# Initialize Flask app and API
app = Flask(__name__)
api = Api(app)

# Configure CORS with credentials support
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True,
        "expose_headers": ["Access-Control-Allow-Credentials"],
        "allow_credentials": True
    }
})

# Load configuration settings
app.config.from_mapping(
    SECRET_KEY='ajali-2',
    TESTING=True,
    SQLALCHEMY_DATABASE_URI='sqlite:///ajali.db',
    SESSION_PERMANENT=True,
    PERMANENT_SESSION_LIFETIME=timedelta(days=1),
    UPLOAD_FOLDER=os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads'),
    MAX_CONTENT_LENGTH=16 * 1024 * 1024  # 16MB max file size
)

# Initialize the database
db.init_app(app)
migrate = Migrate(app, db)

# File upload configuration
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
ALLOWED_VIDEO_EXTENSIONS = {'mp4', 'mov', 'avi', 'mkv'}

# Ensure uploads directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# ---------------- Helper Functions ----------------
def allowed_file(filename, allowed_extensions):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if app.config.get('TESTING'):
            return f(*args, **kwargs)

        if 'user_id' not in session:
            return {'message': 'User not logged in'}, 401
        return f(*args, **kwargs)
    return decorated

# ---------------- File Upload Endpoints ----------------
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# ---------------- Session Validation ----------------
class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        if user_id:
            user = User.query.get(user_id)
            return {'name': user.name, 'id': user.id, 'email': user.email}, 200
        return {}, 401

api.add_resource(CheckSession, '/check_session')

# ---------------- User Management ----------------
class UserRegisterResource(Resource):
    def post(self):
        data = request.get_json()
        required_fields = ['username', 'email', 'password']
        for field in required_fields:
            if field not in data:
                return {'message': f'{field} is required'}, 400

        if User.query.filter_by(username=data['username']).first():
            return {'message': 'Username already exists'}, 400
        if User.query.filter_by(email=data['email']).first():
            return {'message': 'Email already exists'}, 400

        new_user = User(
            username=data['username'],
            email=data['email'],
            password_hash=generate_password_hash(data['password'])
        )

        try:
            db.session.add(new_user)
            db.session.commit()
            return {'message': 'User created successfully'}, 201
        except Exception as e:
            db.session.rollback()
            return {'message': f'Error creating user: {str(e)}'}, 500

class UserLoginResource(Resource):
    def post(self):
        data = request.get_json()
        if not data.get('email') or not data.get('password'):
            return {'message': 'Email and password are required'}, 400

        user = User.query.filter_by(email=data['email']).first()
        if user and check_password_hash(user.password_hash, data['password']):
            session['user_id'] = user.id
            session.permanent = True
            return {'message': 'Login successful', 'user': user.to_dict()}, 200

        return {'message': 'Invalid email or password'}, 401

class UserLogoutResource(Resource):
    def post(self):
        session.clear()
        return {'message': 'Logged out successfully'}, 200

# ---------------- Incident Management ----------------
class IncidentListResource(Resource):
    @login_required
    def get(self):
        incidents = IncidentReport.query.all()
        return jsonify([incident.to_dict() for incident in incidents])

    @login_required
    def post(self):
        data = request.get_json()
        required_fields = ['description', 'latitude', 'longitude']
        for field in required_fields:
            if field not in data:
                return {'message': f'{field} is required'}, 400

        new_incident = IncidentReport(
            description=data['description'],
            status=data.get('status', 'under investigation'),
            latitude=data['latitude'],
            longitude=data['longitude'],
            user_id=session.get('user_id')
        )

        try:
            db.session.add(new_incident)
            db.session.commit()
            return {'message': 'Incident created successfully', 'id': new_incident.id}, 201
        except Exception as e:
            db.session.rollback()
            return {'message': f'Error creating incident: {str(e)}'}, 500

class IncidentResource(Resource):
    @login_required
    def get(self, id):
        incident = IncidentReport.query.get_or_404(id)
        return jsonify(incident.to_dict())

    @login_required
    def put(self, id):
        incident = IncidentReport.query.get_or_404(id)
        if incident.user_id != session.get('user_id'):
            return {'message': 'Permission denied'}, 403

        data = request.get_json()
        incident.description = data.get('description', incident.description)
        incident.status = data.get('status', incident.status)
        incident.latitude = data.get('latitude', incident.latitude)
        incident.longitude = data.get('longitude', incident.longitude)

        db.session.commit()
        return jsonify(incident.to_dict())

    @login_required
    def delete(self, id):
        incident = IncidentReport.query.get_or_404(id)
        if incident.user_id != session.get('user_id'):
            return {'message': 'Permission denied'}, 403

        db.session.delete(incident)
        db.session.commit()
        return {'message': 'Incident deleted'}, 204

# ---------------- Media Upload Resources ----------------
class MediaUploadResource(Resource):
    @login_required
    def post(self, incident_id, media_type):
        if media_type not in ['image', 'video']:
            return {'message': 'Invalid media type'}, 400

        if 'file' not in request.files:
            return {'message': 'No file provided'}, 400
        
        file = request.files['file']
        if file.filename == '':
            return {'message': 'No file selected'}, 400

        allowed_extensions = ALLOWED_IMAGE_EXTENSIONS if media_type == 'image' else ALLOWED_VIDEO_EXTENSIONS
        if not allowed_file(file.filename, allowed_extensions):
            return {'message': f'Invalid {media_type} file type'}, 400

        try:
            # Generate unique filename
            filename = secure_filename(f"{incident_id}_{file.filename}")
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)

            # Create database record
            if media_type == 'image':
                media = IncidentImage(
                    report_id=incident_id,
                    image_url=f'/uploads/{filename}'
                )
            else:
                media = IncidentVideo(
                    report_id=incident_id,
                    video_url=f'/uploads/{filename}'
                )

            db.session.add(media)
            db.session.commit()

            return {
                'message': f'{media_type.capitalize()} uploaded successfully',
                'url': f'/uploads/{filename}'
            }, 201

        except Exception as e:
            db.session.rollback()
            if os.path.exists(file_path):
                os.remove(file_path)
            return {'message': f'Error uploading {media_type}: {str(e)}'}, 500

# ---------------- API Routes ----------------
api.add_resource(UserRegisterResource, '/users')
api.add_resource(UserLoginResource, '/login')
api.add_resource(UserLogoutResource, '/logout')
api.add_resource(IncidentListResource, '/incidents')
api.add_resource(IncidentResource, '/incidents/<int:id>')
api.add_resource(MediaUploadResource, '/incidents/<int:incident_id>/<string:media_type>')

if __name__ == '__main__':
    app.run(debug=True, port=5000)