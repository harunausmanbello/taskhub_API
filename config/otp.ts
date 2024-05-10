import Otp from "../src/models/schema/otp";

export default async function updateExpiredOtps() {
  const thirtySecondsAgo = new Date();
  thirtySecondsAgo.setSeconds(thirtySecondsAgo.getSeconds() - 60);

  await Otp.updateMany(
    { createdAt: { $lt: thirtySecondsAgo }, status: "active" }, // Filtering all the active OTP records > 30 seconds
    { $set: { status: "expired" } } // Set their status to "expired"
  );
}
