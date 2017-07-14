from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse,HttpResponse
from django.views.generic.base import View, TemplateView
from django.core.paginator import Paginator
from .models import *
from django.db.models import Q
import markdown2

def filtByRequestParam(query_set,request):
    query_set=query_set.filter(category__name__icontains= request.GET['category']) if 'category' in  request.GET and  request.GET['category']!='' else query_set
    if 'kws' in  request.GET and  request.GET['kws']!='':
        reg='('+'|'.join( request.GET['kws'].split())+')'
        query_set=query_set.filter(Q(title__iregex=reg)|Q(content__iregex=reg))

    perpage=int( request.GET['perpage']) if ('perpage' in  request.GET and  request.GET['perpage']!='') and int( request.GET['perpage'])>0 else 5
    page=int( request.GET['page']) if ('page' in  request.GET and  request.GET['page']!='' and int( request.GET['page'])>0) else 1
    paginator=Paginator(query_set, perpage)
    try:
        notes=paginator.page(page)
    except:
        notes=paginator.page(1)
    return notes

class HomeView(TemplateView):
    template_name='notebook/index.html'

    def get_context_data(self,**kwargs):
        context=super(HomeView,self).get_context_data(**kwargs)

        categories=Category.objects.order_by('name')
        cate_dict={}
        for c in categories:
            cate_dict[c.name]=c.note_set.count()
        context['categories']=cate_dict

        note_all=Note.objects.order_by('-time_update')
        context['notes']=filtByRequestParam(note_all,self.request)
        return context

class CRUD(View):
    def get(self,request,*args,**kwargs):
        # if request.is_ajax():
        if not request.is_ajax():
            return HttpResponse("not ajax")
        note_set=Note.objects.order_by('-time_create')
        notes=filtByRequestParam(note_set,self.request)

        json={}
        json['page_number']=notes.number
        json['page_total']=notes.paginator.num_pages
        json['notes']=[]
        for note in notes:
            temp={}
            temp['id']=note.id
            temp['title']=note.title
            temp['content']=markdown2.markdown(note.content)
            temp['time_create']=note.time_create.strftime('%b %m,%Y, %H:%M %p')
            temp['time_update']=note.time_update.strftime('%b %m,%Y, %H:%M %P')
            temp['category']=' '.join(c.name for c in note.category.all())
            json['notes'].append(temp)
        return JsonResponse(json)

    def post(self,request,*args,**kwargs):
        for key,value in self.request.POST.items():
            print(key+ ' : '+ value)
        return HttpResponse('got')

    def patch(self,request,*args,**kwargs):
        pass

    def delete(self,request,*args,**kwargs):
        pass

