/**
 * Created by ADDY on 20/12/16.
 */

/*
var kafka = require('kafka-node'),
    Producer = kafka.Producer,
    client = new kafka.Client('35.164.181.50:9092'),
    producer = new Producer(client, { requireAcks: 1 }),
    payloads = [
        { topic: 'clickstreamdata', messages: 'hi'}
    ];

console.log('hello');

producer.on('ready', function () {
    console.log('hello');
    producer.send(payloads, function (err, data) {
        console.log(err || data);
        console.log("successfully sent!");
    });
});

producer.on('error', function (err) {
    console.log('error', err);
});*/


/*

var kafka = require('kafka-node');
var Producer = kafka.Producer;

var client = new kafka.Client(bootstrap_server='35.164.181.50:9092');
var topic = 'clickstreamdata';
var producer = new Producer(client);

var payloads = [
    { topic: topic, messages: 'hi'}
];
console.log("checking producer");

producer.addListener('ready', function () {
    console.log('Kafka producer is ready');
});
*/

/*
producer.on('ready', function () {
    console.log("producer is ready !!!");
    producer.send(payloads, function (err, result) {
        console.log(err || result);
    });
});

producer.on('error', function (err) {
    console.log('error', err);
});*/

var request = require("request");
var AWS = require('aws-sdk');

AWS.config.update({region: 'us-east-1'});


var sqs = new AWS.SQS({apiVersion: '2012-11-05'});


var obj = {
    'username': 'addy',
    'text': 'text',
    'location': 'nyc'
};

var sendParams = {
    MessageBody: JSON.stringify(obj),
    /* required */
    QueueUrl: 'https://sqs.us-east-1.amazonaws.com/829344914533/clickstreamdata', /* required */
    DelaySeconds: 0,
    MessageAttributes: {}
};

sqs.sendMessage(sendParams, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {
        console.log("Pushed to SQS\n");

    }
});


