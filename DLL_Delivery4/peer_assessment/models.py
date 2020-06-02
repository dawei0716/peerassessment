from datetime import datetime
import random
from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone

# Create your models here.
# User model is the model for users based on name, email, id, pwd, and type of user.


class User(models.Model):
    def __str__(self):
        return self.first_name+" " + self.last_name+" "+ self.email
    USER_TYPES = [
        ('S', 'Student'),
        ('I', 'Instructor'),
        ('T', 'TA'),
        ('A', 'Administrator')
    ]

    def validate_digit_length(eagle_id):
        if not (eagle_id.isdigit() and len(eagle_id) == 8):
            raise ValidationError('%(id)s must be 8 digits',
                                  params={'id': eagle_id}, )

    def default_pwd():
        r = random.randint(11111111, 99999999)
        return str(r)

    # key = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=100, null=False)
    last_name = models.CharField(max_length=100, null=False)
    email = models.EmailField(max_length=100, unique=True, null=False)
    password = models.CharField(
        max_length=100, null=False, default=default_pwd())
    eagle_id = models.CharField(verbose_name="id", max_length=8, validators=[validate_digit_length],
                                unique=True, null=False)
    type = models.CharField(max_length=1, choices=USER_TYPES, null=False)


class Class(models.Model):
    def __str__(self):
        return self.class_name

    SEMESTERS = [
        ('1',1),
        ('2',2),
        ('3', 3)
    ]
    # class_id = models.AutoField(primary_key=True)
    # professor_name = models.CharField(max_length=100, null=False)
    class_name = models.CharField(max_length=100, null=False)
    section = models.CharField(max_length=100, null=False)
    semester = models.CharField(max_length=1, choices=SEMESTERS, null=False)
    year = models.CharField(default=datetime.now().strftime("%Y"), max_length=4, null=False)
    code = models.CharField(max_length=100, null=False)
    # instructor_list_id = models.CharField(max_length=100, null=False)


class Group(models.Model):
    def __str__(self):
        return self.group_name
    # group_id = models.AutoField(primary_key=True)
    group_name = models.CharField(max_length=100, unique=True, null=False)
    class_id = models.ForeignKey(Class, on_delete=models.CASCADE, null=False)


class Group_Student(models.Model):
    # def __str__(self):
    #     return self.group_student_id
    # group_student_id = models.AutoField(primary_key=True)
    student_id = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE, null=False)
    # class_id = models.ForeignKey(Class, on_delete=models.CASCADE, null=False)


class Class_Professors(models.Model):
    # def __str__(self):
    #     return self.professor_id
    # class_professors_id = models.AutoField(primary_key=True)
    professor_id = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    class_id = models.ForeignKey(Class, on_delete=models.CASCADE, null=False)


# ------------------------------------------------------------------------------


class Assessment(models.Model):
    def __str__(self):
        return self.assessment_name

    # assessment_id = models.AutoField(primary_key=True)
    assessment_name = models.CharField(max_length=100, null=False)
    creation_date = models.DateField(auto_now=True)
    start_date = models.DateField(null=False)
    due_date = models.DateField(null=False)
    class_id = models.ForeignKey(Class, on_delete=models.CASCADE, null=False)
    released = models.BooleanField(default=False, null=False)
    sent_email = models.BooleanField(default=False, null=False)

class Question(models.Model):
    def __str__(self):
        return str(self.id) + ": " + self.question

    TYPE = [
        ('Multiple Choice', 'Multiple Choice'),
        ('Open Response', 'Open Response')
    ]
    # question_id = models.AutoField(primary_key=True)
    question = models.CharField(max_length=100, null=False)
    type = models.CharField(max_length=100, choices=TYPE, null=False)


class Assessment_Question(models.Model):
    # def __str__(self):
    #     return self.assessment_question_id
    # assessment_question_id = models.AutoField(primary_key=True)
    assessment_id = models.ForeignKey(Assessment, on_delete=models.CASCADE, null=False)
    question_id = models.ForeignKey(Question, on_delete=models.CASCADE, null=False)

class Group_Assessment(models.Model):
    def __str__(self):
        return self.group_id.group_name + ' ' + self.assessment_id.assessment_name
    # group_assessment_id = models.AutoField(primary_key=True)
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE, null=False)
    assessment_id = models.ForeignKey(Assessment, on_delete=models.CASCADE, null=False)


class Grade(models.Model):
    def __str__(self):
        return 'grader: ' + self.grader.first_name + ' ' + self.grader.last_name \
               + ', gradee: ' + self.gradee.first_name+ ' ' + self.gradee.last_name \
                   + 'assessment_question:' + str(self.assessment_question)
    # grader_ass_id = models.AutoField(primary_key=True)
    grader = models.ForeignKey(User, on_delete=models.CASCADE, related_name='grader', null=False)
    gradee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='gradee', null=False)
    assessment_question = models.ForeignKey(Assessment_Question, on_delete=models.CASCADE, null=False)
    score = models.CharField(max_length=100, blank=True, null=True, default=None)
    completion = models.BooleanField(default=False, null=False)

# class Grader(models.Model):
#
#     assignment_id = models.ForeignKey(Assignment, on_delete=models.CASCADE)
#
#     #eval_set_id = models.ForeignKey(Eval_set, on_delete=models.CASCADE)
#     group_id = models.ForeignKey(Group, on_delete=models.CASCADE, default="")
#
#     grader_name = models.CharField(max_length=100, null=False)
#     grader_ass_id = models.AutoField(primary_key=True)
#     aggregate_score = models.CharField(max_length=100, null=False)


# class AssignmentOne(models.Model):
#     group_id = models.ForeignKey(Group, on_delete=models.CASCADE)
#     assignment_id = models.ForeignKey(Assignment, on_delete=models.CASCADE)
#
#     assignment_one_id = models.CharField(max_length=100, primary_key=True)


# class QuestionOne(models.Model):
#     question_id = models.ForeignKey(Question, on_delete=models.CASCADE)
#     qset_id = models.ForeignKey(Assignment, on_delete=models.CASCADE)
#     grade = models.CharField(max_length=100, null=False, default="")
#     comment = models.CharField(max_length=100, null=False, default="")
#     question_one_id = models.CharField(max_length=100, primary_key=True)
#     # question_one_id = models.AutoField(primary_key=True)


# class GraderOne(models.Model):
#     grader_id = models.ForeignKey(User, on_delete=models.CASCADE)
#     grader_ass_id = models.OneToOneField(Grader, on_delete=models.CASCADE)


# class Instructors(models.Model):
#     instructor_id = models.OneToOneField(User, on_delete=models.CASCADE)


# class InstructorSet(models.Model):
#     instructor_list_id = models.ForeignKey(Class, on_delete=models.CASCADE)
#     instructor_id = models.OneToOneField(Instructors, on_delete=models.CASCADE)
#     instructor_set_id = models.CharField(max_length=100, primary_key=True)
#     # instructor_set_id = models.AutoField(primary_key=True)
