import React, { useState, useEffect } from 'react';


function Chatbot() {

  //Chatbot
  useEffect(() => {

    //Code from Kommunicate of the Chatbot
    (function(d, m){
        var kommunicateSettings = 
            {"appId":"167346e06b1420261293f75425ecf1720","popupWidget":true,"automaticChatOpenOnNavigation":true};
        var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
        s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
        var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
        window.kommunicate = m; m._globals = kommunicateSettings;
    })(document, window.kommunicate || {});

  }, []);

  return (
    <>
      
    </>
  );
}

export default Chatbot;