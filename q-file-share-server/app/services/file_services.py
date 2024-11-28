from app.db.db_session import get_db_session
from app.models.db_schemas import FileLog

def get_user_activity(user_email: str):
    db = next(get_db_session())
    activities = db.query(FileLog).filter(
        (FileLog.from_email == user_email) | (FileLog.to_email == user_email)
    ).order_by(FileLog.sent_on.desc()).all()
    return [activity_to_dict(activity) for activity in activities]

def activity_to_dict(activity):
    return {
        "id": activity.id,
        "name": activity.name,
        "size": activity.size,
        "from_email": activity.from_email,
        "to_email": activity.to_email,
        "sent_on": activity.sent_on,
        "expiry": activity.expiry,
        "download_count": activity.download_count,
        "file_id": activity.file_id,
        "is_anonymous": activity.is_anonymous,
        "status": activity.status,
        "updated_at": activity.updated_at,
    }
