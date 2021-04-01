const extId = 'img2b64'

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

	const xhr = new XMLHttpRequest();
	const fileReader = new FileReader();

	xhr.open("GET", clickData.srcUrl, true);
	// Set the responseType to blob
	xhr.responseType = "blob";

	xhr.addEventListener("error", function() {
		showNotification('failed to get image data', 'The image data could not be retrieved xhr error');
	});
	xhr.addEventListener("load", function () {
		if (xhr.status !== 200) {
			showNotification('failed to get image data', 'The image data could not be retrieved invalid http status code');
			return;
		}
		fileReader.onload = function (evt) {
			var result = evt.target.result;
			console.log(result);
                        navigator.clipboard.writeText(result);
                        showNotification('Successfully copied Image Data', 'The image data was successfully copied into the clipboard buffer');

		};
		// Load blob as Data URL
		fileReader.readAsDataURL(xhr.response);
	}, false);
	// Send XHR
	xhr.send();

});

