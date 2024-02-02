// const axios = require('axios')
// const FormData = require('form-data')
// const fs = require('fs')
// const JWT = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxOGIyZDFmMS03ZDdiLTQwZDYtOGNkYS1lODdiZjhlYWJhODIiLCJlbWFpbCI6InByaW5jZWFsbHdpbjE5OUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNGUzM2I5MmU1MTYyYzBlMTc2ODUiLCJzY29wZWRLZXlTZWNyZXQiOiI2NGRkNWJjMGY4NzAyMDY0MmYwYmZlM2E3MzgyMjNkYmM4YjE2MjU4MzgwNmVjZWM4OWFhZGUzNDI4Zjc5MmE4IiwiaWF0IjoxNzA2ODk5MTk0fQ.oAEfrvOdJkdiDm_3bzzpaCI-RjqH5EUr5e9VpGqrm3M

// const pinFileToIPFS = async () => {
//     const formData = new FormData();
//     const src = "path/to/file.png";

//     const file = fs.createReadStream(src)
//     formData.append('file', file)

//     const pinataMetadata = JSON.stringify({
//       name: 'File name',
//     });
//     formData.append('pinataMetadata', pinataMetadata);

//     const pinataOptions = JSON.stringify({
//       cidVersion: 0,
//     })
//     formData.append('pinataOptions', pinataOptions);

//     try{
//       const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
//         maxBodyLength: "Infinity",
//         headers: {
//           'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
//           'Authorization': `Bearer ${JWT}`
//         }
//       });
//       console.log(res.data);
//     } catch (error) {
//       console.log(error);
//     }
// }
// pinFileToIPFS()

// https://green-rapid-felidae-648.mypinata.cloud
