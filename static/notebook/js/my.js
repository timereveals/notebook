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
                    s+='<a class=\'fade\'>Details ></a>';
                    s+='</section>';
                    content+=s;
                }
                if(content==''){
                    content='<h1>Oops. It seems that there\'s nothing related with "'+kws+'".</h1>';
                }else{
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
                }
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

$(document).ready(function(){
    function toFadeIn($e){
        $e.prevAll().fadeIn(1000);
        $e.prev().fadeOut(1000);
        $e.text("< Hide");
        $e.attr("fade_in_or_out","out");
    }
    function toFadeOut($e){
        $e.prevAll().fadeOut(1000);
        var e_to_show=$e.siblings();
        for(var i=0;i<7;i++){
            e_to_show.eq(i).fadeIn(1000);
        }
        $e.prev().fadeIn(3000);
        $e.text("Details >");
        $e.attr("fade_in_or_out","in");
    }
    $(".fade").click(function(){
        if($(this).attr('fade_in_or_out')=='in'){
            toFadeIn($(this));
        }else{
            toFadeOut($(this));
        }
    });
});
function hide_details(section){
    var s_children=section.children("*");
    s_children.hide();
    for(var j=0;j<7;j++){
        s_children.eq(j).show();
    }
    s_children.eq(s_children.length-2).show();
    s_children.eq(s_children.length-1).show();
    s_children.eq(s_children.length-1).innerText="Details >";
}
function init_hide(){
    var len_sections=$("section").length;
    for(var i=0;i<len_sections;i++){
        hide_details($("section").eq(i));
    }
}
