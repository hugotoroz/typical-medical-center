import React, { useEffect } from 'react';

function Chatbot() {
  //Chatbot
  useEffect(() => {
    // Check if the script has already been added
    const existingScript = document.getElementById('kommunicate-script');

    if (!existingScript) {
      const kommunicateSettings = {
        appId: "167346e06b1420261293f75425ecf1720",
        popupWidget: true,
        automaticChatOpenOnNavigation: true,
      };

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src = "https://widget.kommunicate.io/v2/kommunicate.app";
      script.id = 'kommunicate-script'; // Add ID to check if already present

      document.head.appendChild(script);
      window.kommunicate = window.kommunicate || {};
      window.kommunicate._globals = kommunicateSettings;
    } else {
      console.log("Kommunicate script already loaded");
    }
  }, []);

  return null; // In this case doesn't need a visible return
}

export default Chatbot;