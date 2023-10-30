const axios = require('axios');
const xml2js = require('xml2js');

const url = 'https://dav.privateemail.com/contacts';
const username = 'mouimet@infinisoft.world';
const password = 'S3l3c3A3!!!!';

axios({
  method: 'PROPFIND',
  url: url,
  headers: {
    'Depth': 1,
    'Content-Type': 'application/xml; charset=utf-8'
  },
  auth: {
    username: username,
    password: password
  },
  data: `
    <?xml version="1.0" encoding="utf-8" ?>
    <d:propfind xmlns:d="DAV:" xmlns:card="urn:ietf:params:xml:ns:carddav">
      <d:prop>
        <d:getetag />
        <card:address-data />
      </d:prop>
    </d:propfind>
  `
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error('Error fetching contacts:', error);
});



// axios({
//     method: 'PROPFIND',
//     url: url,
//     headers: {
//       'Depth': 0, // Depth 0, as we're querying properties of the current collection/resource
//       'Content-Type': 'application/xml; charset=utf-8'
//     },
//     auth: {
//       username: username,
//       password: password
//     },
//     data: `
//       <?xml version="1.0" encoding="utf-8" ?>
//       <d:propfind xmlns:d="DAV:" xmlns:card="urn:ietf:params:xml:ns:carddav">
//         <d:prop>
//           <d:resourcetype />
//           <card:addressbook-home-set />
//         </d:prop>
//       </d:propfind>
//     `
//   })
//   .then(response => {
//     xml2js.parseStringPromise(response.data).then(parsedResult => {
//       // Here, you can extract the address book URLs from the parsedResult
//       console.log(JSON.stringify(parsedResult));
//     //   const addressBookHomes = parsedResult['d:multistatus']['d:response'].map(resp => resp['d:propstat'][0]['d:prop'][0]['card:addressbook-home-set'][0]['d:href'][0]);
//     //   console.log('Address Book URLs:', addressBookHomes);
//     });
//   })
//   .catch(error => {
//     console.error('Error during discovery:', error);
//   });