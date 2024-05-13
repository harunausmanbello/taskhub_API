import Assignment from "../src/models/schema/assignment";

export default async function updateExpiredCoursesStatus() {
  const currentDate = new Date();

  // Find all courses that are still active
  const activeCourses = await Assignment.find({
    status: "active",
    to: { $lt: currentDate },
  });

  // Update the status of courses whose end date has passed
  for (const course of activeCourses) {
    await Assignment.updateOne({ _id: course._id }, { status: "inactive" });
  }
}
