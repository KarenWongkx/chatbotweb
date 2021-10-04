# Installation

Run: `npm install` to install dependencies

Run: `npm run dev` to run in development mode
Run: `npm start` to run in production mode

# Model API related information

## Description:

Models API was introduced to provide a means to manage the models available on the website. This is used for the display of the frontend dashboard, MultiChatbotInterface and the MassComparison page. This is so that the 3 pages, will display according to the model information taken from the models API instead of declaring explicitly.

## Tools used

**MongoDB,MongoDB Compass**<br/>
Database will be used tp store the model information created using postman. This can be use to better visual data entries created.

**Postman**<br/>
Postman can be used to make API calls, use to add models data into the database.

## Model API Details

Models APIs is available on the backend/routes/generalModel.js

**Methods**<br/>
“/”: return a list of models <br/>
“/new”: create model, if model name exists, it will overwrite data in the model_endpoint with the new content. <br/>
“/deleteAll”: delete all entries. <br/>

## Setup - creating model data during initialization

Frontend display the model details based on the model's attribute (e.g the topic they support). These information are retrieved from the models API. Hence, to begin, the models database should be populated with the model instances.

Model instance can be create using postman (/new) and updating of model information can also use (/new) for update in topic.

**Steps to create model on Postman for existing models**<br/>
Existing models refer to models with its models configuration set up (AskJamie, Diaglogflow, Rushi, Rajat, Bani and Andrew)

1. Ensure backend is running <br/>
2. Open Postman and create a request based on the attributes: <br/>

```bash
Request address:
Method: “GET”
Address: backendaddress/models/new
Body:
Select “Body” and “raw” option, ensure “JSON” is selected as displayed above.
In the body, format:
{
    "name":"model name",
    "model_endpoint":[
        {"topic":"topic", "topic_endpoint":"backend address that the model configuration"},
    ]
}
```

Model_endpoint store the topic that the model supports, it will be used to check if model is available in the frontend display.

Topic_endpoint points to the backend address of the model, it is used on frontend dashboard code to make API call to the backend for query response. 3. Click on “Send”. <br/>

**To Note**<br/>

1. Ensure “AskJamie” is the first entry, this affects the ordering on the frontend display.
2. Do ensure “AskJamie” is saved as ‘AskJamie”.
3. Do ensure that “AskJamie” is an entry in the model API, else there may be error.

**Steps to add in model configuration on backend**<br/>

1. Set up model configuration in the backend/routes (for example, the bani.js file)<br/>
2. Set up middleware in the app.js: <br/>

- Refer to line 2 - 9 (“const modelNameRouter = require(./routes/modelName ))
- Refer to line 22 – 29 (“app.use(‘/modelName’, modelRouter))

**Steps to add model topic on Postman**<br/>
Similar to adding model, however note that model_endpoint will be overwritten, hence:

```bash
Body:
Select “Body” and “raw” option, ensure “JSON” is selected as displayed above.
In the body, format:
{
    "name":"model name",
    "model_endpoint":[
        {existing topic information}
        {new topic information}
    ]
}
```

**Steps to add model topic on Frontend:**<br/>

1. Access frontend/src/dashboard/components/TopicSelection.jsx<br/>
2. Add in the new topic information under the menu. <br/>

```bash
<MenuItem id={"TopicName”}
          onClick={(e) => {
            props.setTopic(e.target.id)
            setTopicMenuRef(null)
          }}
        > TopicName
   </MenuItem>
```

3. To ensure that TopicName is the same as the topic’s name declare on the API’s topic name.<br/>
