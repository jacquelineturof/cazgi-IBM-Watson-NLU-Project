const express = require('express');
const dotenv = require('dotenv')
const app = new express();
dotenv.config()

const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
    version: '2020-08-01',
    authenticator: new IamAuthenticator({
      apikey: process.env.API_KEY,
    }),
    serviceUrl: process.env.API_URL,
  });

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());


app.get("/",(req,res)=>{

    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    const { url } = req.query
    
    const analyzeParams = {
      url,
      features: {
        emotion: {
          document: true
        }
      }
    }

      naturalLanguageUnderstanding.analyze(analyzeParams)
  .then(analysisResults => {
    const result = analysisResults.result.emotion.document.emotion
    return res.send(result)
  })
  .catch(err => {
    console.log('err: ', err)
    return res.send({"happy":"90","sad":"10"});
  });
    
});

app.get("/url/sentiment", (req,res) => {
  const { url } = req.query

  const analyzeParams = {
    url,
    features: {
      sentiment: {
        document: true
      }
    }
  }

  naturalLanguageUnderstanding.analyze(analyzeParams)
  .then(analysisResults => {
    const result = analysisResults.result.sentiment.document.label
    console.log('result: ', result)
    return res.send(result)
  })
  .catch(err => {

    console.log('err: ', err)
    return res.send("url sentiment for "+url);
  });
});

app.get("/text/emotion", (req,res) => {
    const { text } = req.query
    const analyzeParams = {
      text,
      features: {
        emotion: {
          document: true
        }
      }
    }

    naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(analysisResults => {
      const result = analysisResults.result.emotion.document.emotion
      return res.send(result)
    })
    .catch(err => {
      console.log('err: ', err)
      return res.send({"happy":"90","sad":"10"});
    });
});

app.get("/text/sentiment", (req,res) => {
    const { text } = req.query
    const analyzeParams = {
      text,
      features: {
        sentiment: {
          document: true
        }
      }
    }

    naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(analysisResults => {
      const result = analysisResults.result.sentiment.document.label
      return res.send(result)
    })
    .catch(err => {
      console.log('err: ', err)
      return res.send("text sentiment for "+text);
    });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

