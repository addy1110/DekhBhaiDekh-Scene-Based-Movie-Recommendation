/**
 * Created by ADDY on 20/11/16.
 */
/**
 * Created by ADDY on 20/11/16.
 */
$(function() {
    if ($.browser.msie && $.browser.version.substr(0,1)<7)
    {
        $('li').has('ul').mouseover(function(){
            $(this).children('ul').css('visibility','visible');
        }).mouseout(function(){
            $(this).children('ul').css('visibility','hidden');
        })
    }
});