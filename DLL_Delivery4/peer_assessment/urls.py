from django.urls import path

from . import views, requestHandler, changepassword, allassessmentsprof, profaggregatedresults, homepages, teamshandler, studentpeerassessments
from rest_framework import routers
from .api import AssessmentViewSet

# router = routers.DefaultRouter()
# router.register('api/assessments', AssessmentViewSet, 'assessments')
# router.register('validate', )

# urlpatterns = router.urls

# app_name = 'peer_assessment'
#

#While most url navigation is handled by react, the one actual request made to validate uses this path so we can
# take the request and send it to the requestHandler server side
urlpatterns = [
    path('validate/', requestHandler.validate_user),
    path('verifychangepassword/', changepassword.change_password),
    path('addassessmentreq/', allassessmentsprof.add_assessment),
    path('assessmentview/', allassessmentsprof.view_assessments),
    # path('professorhomepage?<str:email>/<str:type>', homepages.view_professor_homepage),
    path('professorhomepage/', homepages.view_professor_homepage),
    path('studenthomepage/', homepages.view_student_homepage),
    path('studentteams/', teamshandler.view_teams),
    path('studentpeerassessments/', studentpeerassessments.view_assessments),
    path('studentcompletedassessments/', studentpeerassessments.view_completed_assessments),
    path('studentaggregatedresults/', studentpeerassessments.student_aggregated_results),
    path('makenewteam/', teamshandler.add_team),
    path('makenewstudent/', teamshandler.add_student),
    path('professordeadlineupdate/', allassessmentsprof.deadline_update),
    path('studentgrade/', studentpeerassessments.student_grade),
    path('resultsaggregated/', profaggregatedresults.view_aggregated_results),
    path('getquestions/', allassessmentsprof.view_all_questions),
    path('makenewquestion/', allassessmentsprof.add_question),
    path('releaseresults/', profaggregatedresults.release_results),
    path('downloadresults/', profaggregatedresults.download_results),
    path('studentdetailedresults/', profaggregatedresults.view_student_detailed),
    path('teamdetailedresults/', profaggregatedresults.view_team_detailed),
    path('remind/', profaggregatedresults.remind_student)
]