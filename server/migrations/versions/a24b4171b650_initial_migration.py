"""Initial migration

Revision ID: a24b4171b650
Revises: 
Create Date: 2024-11-19 11:04:45.306113

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a24b4171b650'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=50), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('password_hash', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('incident_reports',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('description', sa.Text(), nullable=False),
    sa.Column('status', sa.String(length=50), nullable=True),
    sa.Column('latitude', sa.Float(), nullable=False),
    sa.Column('longitude', sa.Float(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('incident_images',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('report_id', sa.Integer(), nullable=False),
    sa.Column('image_url', sa.String(length=255), nullable=False),
    sa.ForeignKeyConstraint(['report_id'], ['incident_reports.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('incident_videos',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('report_id', sa.Integer(), nullable=False),
    sa.Column('video_url', sa.String(length=255), nullable=False),
    sa.ForeignKeyConstraint(['report_id'], ['incident_reports.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('incident_videos')
    op.drop_table('incident_images')
    op.drop_table('incident_reports')
    op.drop_table('users')
    # ### end Alembic commands ###
