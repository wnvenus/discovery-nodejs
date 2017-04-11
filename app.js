/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const express = require('express');
const app = express();

const queryBuilder = require('./query-builder');

const DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
const discovery = new DiscoveryV1({
  // If unspecified here, the DISCOVERY_USERNAME and
  // DISCOVERY_PASSWORD env properties will be checked
  // After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
  username: '4ce08b81-9777-4ca0-9f0f-b580ffb1699d',
  password: 'uWbFhrSUtb5V',
  version_date: '2016-11-09',
  path: {
    environment_id: process.env.ENVIRONMENT_ID || 'aeb3bddc-16c2-4c9e-9fd5-9d1216651968',
    collection_id: process.env.COLLECTION_ID || '41f28045-499c-40b4-904d-c8c086b1eb55',
  },
  qs: { aggregation: `[${queryBuilder.aggregations.join(',')}]` },
});


// Bootstrap application settings
require('./config/express')(app);

app.get('/', (req, res) => {
  res.render('index', {
    BLUEMIX_ANALYTICS: process.env.BLUEMIX_ANALYTICS,
  });
});

app.post('/api/query', (req, res, next) => {
  const params = queryBuilder.build(req.body);
  discovery.query(params, (error, response) => {
    if (error) {
      next(error);
    } else {
      res.json(response);
    }
  });
});

// error-handler settings
require('./config/error-handler')(app);

module.exports = app;
