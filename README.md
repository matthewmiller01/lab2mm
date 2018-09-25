# Lab 2
Overall Schema of Website:

At the index page, the user has the option to click on any gallery they would like. Upon clicking on the gallery, a list of objects is displayed that we render using the gallery template. Each of those objects has a title. Upon clicking on the link of the title of an object, we render the object template, which lists certain things about the object like its provenance, accession year, and various other details.

Code Method:

Under the hood after the user clicks on a gallery, we asynchronously render the gallery template after the fetch request successfully gets us the response data that will give us a list of objects in the gallery clicked upon. We refer to all the objects in this gallery as "data.records" because this returns a JavaScript list object with each object and its variables specific to that gallery.

When the user clicks on an individual object, we implement a get request to go to the route for that object page using its ID. Like with the gallery route, we also fetch all data for that specific object asynchronously. We render the object template we created and pass in all variables from the "data" about this object that we want to display in the template, which includes title, description, accessionyear, provenance, primaryimageurl, and id, all variables specified in the object API.

Handling Comments:

Within the object template, we also use HTML to create a form through which the user can submit comments. When a comment is submitted, we submit a post request to the route '/commenthandler/:object_id' where the latter part of the address is the actual ID of the object for which the comment was submitted. At this commenthandler route, now we push the comment into a larger JavaScript list object that holds all comments. Each object in this JavaScript object has two variables: the text of the comment itself and the ID of the object to which it belongs. We then redirect to the route for the object, which we recreate by using the object_id variable passed into the post request through the URL.

Each time the route for an individual object is reached, we loop through all the comments in our larger JavaScript object list of comments called "comments" and compare the ID of each comment to the ID of the current object whose page we are on. If the IDs match, we add the comment to an individual list for this object called objectcomms and ultimately pass in this individualized list of comments to the rendered object template, where all the comments will be displayed.
