import { createApplication, getApplicationsByJob, getApplicationById, deleteApplication } from "../models/application";

export async function submitApplication(data: any) {
  if (!data.job_id || !data.name || !data.email || !data.resume_link) {
    throw new Error("Missing required application fields");
  }
  const application = await createApplication(data);
  return application;
}

export async function getJobApplications(jobId: number) {
  const applications = await getApplicationsByJob(jobId);
  return applications;
}

export async function getSingleApplication(id: number) {
  const application = await getApplicationById(id);
  if (!application) {
    throw new Error("Application not found");
  }
  return application;
}

export async function removeApplication(id: number) {
  await deleteApplication(id);
  return { message: "Application deleted successfully" };
}
