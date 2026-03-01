import { getJobs, getJobById, createJob, deleteJob } from "../models/job";

export async function getAllJobs(filters: any) {
  try {
    const jobs = await getJobs(filters);
    return jobs;
  } catch (error) {
    throw new Error("Failed to fetch jobs");
  }
}

export async function getSingleJob(id: number) {
  const job = await getJobById(id);
  if (!job) {
    throw new Error("Job not found");
  }
  return job;
}

export async function addJob(data: any) {
  if (!data.title || !data.company || !data.category) {
    throw new Error("Missing required job fields");
  }
  const job = await createJob(data);
  return job;
}

export async function removeJob(id: number) {
  await deleteJob(id);
  return { message: "Job deleted successfully" };
}
