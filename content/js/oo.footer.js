    
    //MJ:This code will executed on each anchor click and will get the id of iframe to refresh it	
   $(document).ready(function() {
        $("a").click(function() {
//alert("a click");
        var iframeToRefresh = oo.common.getIframeToRefresh($(this).text());
       // alert(iframeToRefresh );
          //this is to ensure that if back button is pressed following should execute
          if($(this).text() == 'Back' || $(this).text() == ' Back')
          {
             
             //alert(window.history.go(-1));
             
          }
          else if($(this).text() == 'Assign to Team'|| $(this).text() == 'Apply for an Account')
          {
             location.reload();
          }
          if($(this).text() == '2. Process Model' || $(this).text() == 'Processes and Steps')
          {
             if (document.body === document.activeElement ||
	        document.activeElement.tagName == 'IFRAME') {
	       
	        var iframes = document.getElementsByTagName('iframe');
	        for (var i = 0; i < iframes.length; i++) {
	            // Recall
	            var activeIframe = $(iframes[i]).attr('id');
	
	            if (activeIframe !== false) {
	                if (activeIframe != "intercom-frame" || activeIframe != "iframeResizer0") {
	                 
	                    $("#" + activeIframe).attr('src', $("#" + activeIframe).attr('src'));
	                }
	            }
	        }
	    }
          }
          else if (typeof iframeToRefresh  != "undefined") 
          {
               
          	//$("#"+ iframeToRefresh).attr('src', $("#"+ iframeToRefresh).attr('src'));
          }

           
        });
       
    });


