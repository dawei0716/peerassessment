from django.views.decorators.csrf import csrf_exempt, requires_csrf_token
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from peer_assessment.models import *
from django.core import serializers

# from snippets.models import Snippet
# from snippets.serializers import SnippetSerializer
import datetime
import json

# Gets the right assessments to be displayed on Professor assessment page
# Also handles csrf token in order to allow the request to go through

# Complete (?)
@requires_csrf_token
@api_view(['POST'])
def view_assessments(request):
    """
    List all code snippets, or create a new snippet.
    """
    print("CALLING VIEW ASSESSMENTS")

    data = request.data
    print(data)
    email = data.get("email")
    t = data.get("type")
    selectedClass = data.get("selectedClass")

    c = Class.objects.get(pk=selectedClass)
    a = Assessment.objects.filter(class_id=c,)
    closed = list()
    open = list()
    for i in a:
        if i.due_date >= datetime.date.today():
            open.append(i)
        else:
            closed.append(i)
    openassessments = serializers.serialize('json', open)
    closedassessments = serializers.serialize('json', closed)
    # print(openassessments)
    # print(closedassessments)
    # print(assessments)

    b = "F"
    # Try to write to database to add assessment to list, dummy code in place
    try:
        # user = User.objects.get(email=email, password=currentPassword)
        b = "t"
    except:
        b = "F"
    print(b)
    return Response([openassessments, closedassessments], status=status.HTTP_200_OK)


# Code ran when the professor does add assessment
# Also handles csrf token in order to allow the request to go through
@requires_csrf_token
@api_view(['POST'])
def add_assessment(request):
    """
    List all code snippets, or create a new snippet.
    """
    print("ADD_ASSESSMENT SERVLET")
    data = request.data
    assessmentName = data.get("name")
    startDate = data.get("startDate")
    dueDate = data.get("dueDate")
    email = data.get("email")
    t = data.get("type")
    selectedClass = data.get("selectedClass")
    # selectedClass = json.loads(selectedClass)
    print(data)
    print(selectedClass)
    # -------------------------------------------
    b = "F"
    c = Class.objects.get(pk=selectedClass)
    class_groups = Group.objects.filter(class_id=c)

    assessment = Assessment.objects.create(assessment_name=assessmentName, due_date=dueDate,
                                           start_date=startDate, class_id=c)
    print(class_groups)
    assessment.save()
    qpks = [x for x in range(1,11)]
    qs = Question.objects.filter(pk__in=qpks)
    assess_qs = list()
    for q in qs:
        assess_q = Assessment_Question.objects.create(
            assessment_id=assessment, question_id=q)
        assess_q.save()
        assess_qs.append(assess_q)

    for group in class_groups:
        g_a = Group_Assessment.objects.create(
            group_id=group, assessment_id=assessment)
        g_a.save()
        group_students = Group_Student.objects.filter(
            group_id=group).values_list('student_id', flat=True)
        students = User.objects.filter(pk__in=group_students)
        print(students)
        for grader in students:
            for gradee in students:
                for aq in assess_qs:
                    grade = Grade.objects.create(
                        grader=grader, gradee=gradee, assessment_question=aq)
                    grade.save()
    print(assessment)
    assess = Assessment.objects.get(pk=assessment.id)
    a = serializers.serialize('json', [assess, ])
    # Try to write to database to add assessment to list, dummy code in place
    try:

        b = "t"
    except:
        b = "F"
    print(b)
    print(data)
    return Response(a, status=status.HTTP_200_OK)

# Code ran when the professor does grades assessment
# Also handles csrf token in order to allow the request to go through
@requires_csrf_token
@api_view(['POST'])
def deadline_update(request):
    """
    List all code snippets, or create a new snippet.
    """
    data = request.data
    # toDoIndex = data.get("toDoIndex")
    # todoSelected = data.get("todoSelected")
    pk = data.get("pk")
    email = data.get("email")
    dueDate = data.get("dueDate")
    t = data.get("type")
    # print(toDoIndex)
    # print(todoSelected)
    assessment = Assessment.objects.get(pk=int(pk))
    assessment.due_date = dueDate
    assessment.save()
    b = "F"
    assess = Assessment.objects.get(pk=assessment.id)
    a = serializers.serialize('json', [assess, ])
    # Try to write to database to add assessment to list, dummy code in place
    try:
        # user = User.objects.get(email=email, password=currentPassword)
        b = "t"
    except:
        b = "F"
    print(b)
    print(data)
    return Response(a, status=status.HTTP_200_OK)


### ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~####

@requires_csrf_token
@api_view(['POST'])
def add_question(request):
    data = request.data
    q_type = data.get("questionType")
    question = data.get("question")




    try:
        b = "already in db"
        qGet = Question.objects.get(question=question, type=q_type)
        print("found in db")
        a = "None"

    except:
        b = "adding to db"
        question = Question.objects.create(question=question, type=q_type)
        question.save()
        q = Question.objects.get(pk=question.id)
        a = serializers.serialize('json', [q, ])

    print(b)
    print(data)
    print(a)
    return Response(a, status=status.HTTP_200_OK)


@requires_csrf_token
@api_view(['POST'])
def view_all_questions(request):
    print("VIEW QUESTIONS")
    try:
        q = Question.objects.all()
        questions = serializers.serialize('json', q)
        b = "t"
    except:
        b = "F"
    print(b)
    print(questions)
    return Response(questions, status=status.HTTP_200_OK)
