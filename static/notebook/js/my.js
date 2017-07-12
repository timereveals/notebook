function myfunction(category,kws,perpage,page){
    $.ajax(
        {
            url:'/notebook/crud/',
            type:'GET',
            data:{
                category:category,
                kws:kws,
                perpage:perpage,
                page:page
            },
            timeout:5000,
            dataType:'json',
            success:function(result){
                var content="";
                for(var i=0;i<result.notes.length;i=i+1){
                    var s='<section>';
                    s+='<h1>'+result.notes[i].title+result.notes[i].id+'</h1>';
                    var categories=result.notes[i].category.split(' ');
                    var links='';
                    for(var j=0,len=categories.length;j<len;j++){
                        links+='<a onclick=\"myfunction(\''+category+'\',\''+''+'\','+0+','+1+")\" >"+categories[j]+".</a>";
                    }
                    s+='<h5>'+result.notes[i].time_update+' in '+links+'</h5>';
                    s+=result.notes[i].content;
                    s+='</section>';
                    content+=s;
                }
                pagination='<section><center><p>';
                if(result.page_number>1){
                    pagination+='<a onclick=\"myfunction(\''+category+'\',\''+kws+'\','+perpage+','+(page-1)+")\" >Previous</a>";
                }
                pagination+=result.page_number+"/"+result.page_total;
                if(result.page_number<result.page_total){
                    pagination+='<a onclick=\"myfunction(\''+category+'\',\''+kws+'\','+perpage+','+(page+1)+")\" >Next</a>";
                }
                pagination+='</p></center></section>';
                content+=pagination;
                document.getElementById("main").innerHTML=content;
            }
        }
    );
}

$.fn.tagcloud.defaults={
    size:{start:12,end:36,unit:'px'},
    color:{start:'#f44365',end:'#3dbcca'}
};
$(function(){
    $('#category a').tagcloud();
});

// $("#search").keydown(function(e){
//     alert("down");
//     if(e.keyCode == 13){
//         alert("enter");
//     }
// });
$(function(){
    $("#search").bind('keypress',function(event){
        if(event.keyCode == '13'){
            myfunction('',$('#search').val(),0,0);
        }
    });
});
