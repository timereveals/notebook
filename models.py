from django.db import models

# Create your models here.
from django.template.defaultfilters import slugify

class Category(models.Model):
    name=models.CharField(max_length=64)

    def __str__(self):
        return self.name

class Note(models.Model):
    title=models.CharField(max_length=128)
    content=models.TextField()
    time_create=models.DateTimeField(auto_now_add=True)
    time_update=models.DateTimeField(auto_now=True)
    category=models.ManyToManyField(Category)

    def __str__(self):
        return self.title

# class Comment(models.Model):
#     name=models.CharField(max_length=128)
#     content=models.TextField()
#     dt_create=models.DateTimeField(auto_now_add=True)
#     note=models.ForeignKey(Note,on_delete=models.CASCADE)
#     def __str__(self):
#         return self.date_time+" "+self.name+":"+self.content
