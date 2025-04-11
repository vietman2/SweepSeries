from .academy import AcademyReviewSerializer
from .coach import CoachReviewSerializer
from .contract import ContractSerializer
from .review import ReviewSerializer
from .tags import CoachReviewTagSerializer, LessonReviewTagSerializer, AcademyReviewTagSerializer

__all__ = [
    'AcademyReviewSerializer',
    'CoachReviewSerializer',
    'ContractSerializer',
    'ReviewSerializer',
    'CoachReviewTagSerializer',
    'LessonReviewTagSerializer',
    'AcademyReviewTagSerializer'
]
