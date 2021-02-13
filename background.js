const extId = 'Copy Image As Base64 Data URL'

async function showNotification(title,message){
	const options = {
		"type": "basic",
		"iconUrl": browser.runtime.getURL("icon.png"),
		"title": extId + ": " + title,
		"message": message
	};
	try {
		const nid = await browser.notifications.create(extId, options);
		return nid;
	}catch(err){
		onError(err, 'failed notificationId.create');
	}
	return null;
}

function onError(e, msg){
	console.log(`${extId}::onError error: ${e}, message: ${msg}`);
}

browser.menus.create({   // menus permission 
	id: extId,
	title: extId,
	documentUrlPatterns: [ "<all_urls>" ],
	contexts: ["image" ]
});


browser.menus.onClicked.addListener( async (clickData,tab) => {
	if(clickData.menuItemId !== extId){
		return;
	}
	try {
		const reader = new FileReader();
		const response = await fetch(clickData.srcUrl); // <all_urls> permissions 

		const body = await response.blob()
		reader.onload = function() {
			console.log(reader.result);
			navigator.clipboard.writeText(reader.result);
			showNotification('Successfully copied Image Data', 'The image data was successfully copied into the clipboard buffer');
		}
		reader.onerror = function() {
			// read failed 
			showNotification('failed to read image data', 'The image data could not be processed via the FileReader API');
		}
		reader.readAsDataURL(body);
	}catch(e){
		showNotification('failed to fetch image data', 'The image date could not be retrieved via the Fetch API');
	}
});

