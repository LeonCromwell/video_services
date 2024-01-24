const { Storage } = require("@google-cloud/storage");

const storage = new Storage({
  projectId: "driven-airway-411306",
  keyFilename: "./driven-airway-411306-1cfba86e458c.json",
});

const bucketName = "hlsstreaming";

async function configureBucketCors() {
  const corsConfiguration = [
    {
      maxAgeSeconds: 3600, // Max age of preflight request
      method: ["GET", "HEAD", "POST", "PUT", "DELETE"], // Allowed HTTP methods
      origin: ["*"], // Allowed origins (all origins)
      responseHeader: ["*"], // Allowed response headers
    },
  ];
  await storage.bucket(bucketName).setCorsConfiguration(corsConfiguration);

  console.log(`Bucket ${bucketName} was updated with a CORS config
        to allow 'GET', 'HEAD', 'POST', 'PUT', 'DELETE' requests from * sharing 
        * responses across origins`);
}

module.exports = {
  configureBucketCors,
  storage,
  bucketName,
};
