from django.views.decorators.csrf import csrf_exempt, requires_csrf_token
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from peer_assessment.models import *
from django.core import serializers
from django.http import HttpResponse
from email.message import EmailMessage

# from snippets.models import Snippet
# from snippets.serializers import SnippetSerializer
import datetime
import json
import smtplib

from django.core.mail import send_mail
from django.conf import settings


@requires_csrf_token
@api_view(['POST'])
def view_aggregated_results(request):
    """
    List all code snippets, or create a new snippet.
    """
    data = request.data
    email = data.get("email")
    t = data.get("type")
    selectedClass = data.get("selectedClass")
    selectedAssessment = data.get("selectedAssessment")

    b = "Fail"

    studentsGrid = list()
    teamsGrid = list()

    try:
        # qpks = [x for x in range(1, 11)]
        all_mc_questions = Question.objects.filter(type="Multiple Choice")
        mc_questions = Assessment_Question.objects.filter(
            assessment_id=selectedAssessment, question_id__in=all_mc_questions)

        # Get CLASS and GROUPS
        c = Class.objects.get(pk=selectedClass)
        g = Group.objects.filter(class_id=c)
        print(g)
        for team in g:
            stu = list()
            t = team.group_name
            print(t)
            gs = Group_Student.objects.filter(group_id=team)
            ids = list()
            for i in gs:
                ids.append(i.student_id.id)

            # Have STUDENTS in TEAM
            user_id = User.objects.filter(pk__in=ids)
            print(user_id)
            team_score_sum = 0
            team_member_count = 0
            for user in user_id:
                team_member_count += 1
                gradee = Grade.objects.filter(gradee=user, assessment_question__in=mc_questions)
                grader = Grade.objects.filter(grader=user, assessment_question__in=mc_questions,completion=False)
                print("len(grader)=" +str(len(grader)))

                score = 0
                count = 0
                avg_score = 0
                # If it is not then we do nothing right now, but we could make all the other grades
                # of this student in the db 0. Right now, we just do math to make it 0
                didAssessment = False
                if(len(grader)==0):
                    didAssessment = True
                    for grad in gradee:
                        # If score isn't filled out the value of it is NONE

                        if(grad.assessment_question.question_id.type=='Multiple Choice' and grad.completion==True):
                            score += int(grad.score)
                        count += 1
                    avg_score = score/count
                team_score_sum += avg_score
                name = user.first_name + " " + user.last_name

                stu.append(name)

                studentsGrid.append(
                    {
                        "user_id": user.id,
                        "name": name,
                        "team": t,
                        "avg_score": round(avg_score,2),
                        "completed": didAssessment
                    }
                )
            print(studentsGrid)
            if team_member_count != 0:
                team_avg_score = team_score_sum/team_member_count
            else:
                team_avg_score = 0
            teamsGrid.append(
                {
                    "team_id": team.id,
                    "name": t,
                    "members": stu,
                    "avg_score": round(team_avg_score,2)
                }
            )
            print(teamsGrid)
        print(studentsGrid)
        print("@@@@@@@@@@@@@@")
        print(teamsGrid)
        b = "success"
    except:
        b = "Fail"
    print(b)

    return Response([studentsGrid, teamsGrid], status=status.HTTP_200_OK)


@requires_csrf_token
@api_view(['POST'])
def release_results(request):
    """
        List all code snippets, or create a new snippet.
        """
    data = request.data
    email = data.get("email")
    t = data.get("type")
    # selectedClass = data.get("selectedClass")
    selectedAssessment = data.get("selectedAssessment")
    a = Assessment.objects.get(pk=selectedAssessment)
    print(a)
    a.released = True
    a.save()
    b = "Fail"
    try:

        b = "success"
    except:
        b = "Fail"
    print(b)
    return Response(b, status=status.HTTP_200_OK)

@requires_csrf_token
@api_view(['GET'])
def download_results(request):
    """
        List all code snippets, or create a new snippet.
        """
    email = request.query_params.get('email')
    user_type = request.query_params.get('type')
    assessquery = request.query_params.get('assessment')
    assessment = Assessment.objects.get(pk=assessquery)
    print(assessment)
    class_name = assessment.class_id.class_name
    print(class_name)

    csv = 'Results for assessment: ' + str(assessment.assessment_name) + ' in class: ' + str(class_name) + '\n\n'
    ga = Group_Assessment.objects.filter(assessment_id=assessment)
    for i in ga:
        group_name = i.group_id.group_name
        gs = Group_Student.objects.filter(group_id=i.group_id)
        for j in gs:
            stu_name = j.student_id.first_name + ' ' + j.student_id.last_name
            csv += 'Grade for: ' + str(stu_name) + ' in Group: ' + str(group_name) + '\n'
            assessment_questions = Assessment_Question.objects.filter(assessment_id=assessment)
            for q in assessment_questions:
                csv += ',"'+q.question_id.question+'"'
            csv += '\n'
            for k in gs:
                grades = Grade.objects.filter(grader=k.student_id, gradee=j.student_id,
                                              assessment_question__in=assessment_questions)
                grader_name = k.student_id.first_name + " " + k.student_id.last_name
                csv += '"'+str(grader_name)+'"'
                for g in grades:
                    if g.completion:
                        csv += ',"' + str(g.score)+'"'
                    else:
                        csv += ',incomplete'
                csv += '\n'
            csv += '\n'
        csv += '\n'
    response = HttpResponse(
        content=csv.encode(),
        content_type="text/csv",
    )
    response["Content-Disposition"] = 'attachment; filename="assessment_results.csv"'
    return response

@requires_csrf_token
@api_view(['POST'])
def view_student_detailed(request):
    data = request.data
    email = data.get("email")
    t = data.get("type")
    selectedAssessment = data.get("selectedAssessment")
    user = data.get("selectedUser")

    student = User.objects.get(pk=user['user_id'])

    res =list()
    qpks = [x for x in range(1, 11)]
    qs = Question.objects.filter(pk__in=qpks)
    aqs = Assessment_Question.objects.filter(assessment_id=selectedAssessment, question_id__in=qs)

    didAssessment = True
    grader = Grade.objects.filter(grader=student, assessment_question__in=aqs, completion=False)

    if len(grader) > 0:
        didAssessment = False

    for i in qs:
        aq = Assessment_Question.objects.get(assessment_id=selectedAssessment, question_id=i)
        completed = True
        gradergrades = Grade.objects.filter(grader=student, assessment_question=aq, completion=False)
        if len(gradergrades)> 0:
            completed = False
        grades = Grade.objects.filter(gradee=student, assessment_question=aq)
        gradeList = list()
        for j in grades:
            if j.completion:
                gradeList.append(
                    {
                        "grader": j.grader.first_name + " " +j.grader.last_name,
                        "score": j.score
                    }
                )
            else:
                gradeList.append(
                    {
                        "grader": j.grader.first_name + " " +j.grader.last_name,
                        "score": "Didn't complete assessment"
                    }
                )
        res.append(
            {
                "question_id": i.id,
                "question": i.question,
                "grades": gradeList,
                "completion": completed
            }
        )
    return Response([res, didAssessment], status=status.HTTP_200_OK)

@requires_csrf_token
@api_view(['POST'])
def view_team_detailed(request):
    data = request.data
    t = data.get("selectedTeam")
    selectedAssessment = data.get("selectedAssessment")
    print(t)
    print(selectedAssessment)

    assessment = Assessment.objects.get(pk=selectedAssessment)
    team = Group.objects.get(pk=t["team_id"])

    gs = Group_Student.objects.filter(group_id=team)

    res = list()

    for j in gs:
        stu_name = j.student_id.first_name + ' ' + j.student_id.last_name
        assessment_questions = Assessment_Question.objects.filter(assessment_id=assessment)
        grades = list()
        for q in assessment_questions:
            gr = Grade.objects.filter(gradee=j.student_id, assessment_question=q)
            sc = list()
            for s in gr:
                if s.completion:
                    sc.append(
                        {
                            "grader": s.grader.first_name + " " + s.grader.last_name,
                            "score": s.score
                        }
                    )
                else:
                    sc.append(
                        {
                            "grader": s.grader.first_name + " " + s.grader.last_name,
                            "score": "Didn't complete assessment"
                        }
                    )

            grades.append(
                {
                    "question_id": q.question_id.id,
                    "question": q.question_id.question,
                    "scores": sc
                }
            )
        res.append(
            {
                "name": stu_name,
                "res": grades
            }
        )

    return Response(res, status=status.HTTP_200_OK)

@requires_csrf_token
@api_view(['POST'])
def remind_student(request):
    data = request.data
    prof = data.get("email")
    assess = data.get("selectedAssessment")
    stu = data.get("student")
    type = data.get("tpye")
    print(data)

    assessment = Assessment.objects.get(pk=assess)
    # professor = User.objects.get(email=prof)
    student = User.objects.get(pk=stu["user_id"])

    subject = 'Reminder that you missed completing an assessment'
    message = 'This is an email reminding you that you failed to complete assessment: ' + \
                    str(assessment.assessment_name) + ', for team: ' + str(stu["team"]) + \
                    ' by the deadline. Your Score for this assessment is 0'
    email_from = settings.EMAIL_HOST_USER
    recipient_list = ['yangud@bc.edu', str(student.email)]
    send_mail(subject, message, email_from, recipient_list)
    return Response("reminded", status=status.HTTP_200_OK)
