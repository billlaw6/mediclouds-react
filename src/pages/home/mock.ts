/* eslint-disable @typescript-eslint/camelcase */
import { ExamIndexI } from "_constants/interface";
import { Random, mock } from "mockjs";

const generateData = (count: number): ExamIndexI[] => {
  const result = [];

  for (let i = 0; i < count; i++) {
    const data: ExamIndexI = {
      // sex: 1,
      // birthday: "",
      // display_frame_rate: 40,
      id: Random.string(),
      // patient_id: Random.string(),
      patient_name: Random.cname(),
      // created_at: new Date(),
      // institution_name: Random.csentence(),
      desc: Random.csentence(),
      thumbnail: "https://source.unsplash.com/random/300x300",
      study_date: Random.date("yyyy-MM-dd"),
      modality: mock({
        "arr|1": ["CT", "OCT", "CAT"],
      }).arr,
    };
    result.push(data);
  }

  console.log("result: ", result);
  return result;
};

// console.log(generateData(5));
export default generateData(25);

// export default [
//   {
//     id: "1",
//     modality: "CT",
//     patient_name: "123",
//     created_at: new Date(),
//     desc: "",
//     patient_id: "1_1",
//     institution_name: "hhh",
//     study_date: "2019-01-01",
//     thumbnail: "",
//   },
//   {
//     id: "2",
//     modality: "AAA",
//     patient_name: "456",
//     created_at: new Date(),
//     desc: "hhhhh",
//     patient_id: "1_2",
//     institution_name: "sssss",
//     study_date: "2019-11-23",
//     thumbnail: "http://m.imeitou.com/uploads/allimg/2018082311/qdtnl3ajzuf.jpg",
//   },
//   {
//     id: "4",
//     modality: "AAA1",
//     patient_name: "456",
//     created_at: new Date(),
//     desc: "hhhhh",
//     patient_id: "1_3",
//     institution_name: "sssss",
//     study_date: "2019-11-23",
//     thumbnail: "http://m.imeitou.com/uploads/allimg/2018082311/qdtnl3ajzuf.jpg",
//   },
//   {
//     id: "3",
//     modality: "AAA1",
//     patient_name: "42256",
//     created_at: new Date(),
//     desc: "hhhhh",
//     patient_id: "1_4",
//     institution_name: "sssss",
//     study_date: "2019-11-23",
//     thumbnail: "http://m.imeitou.com/uploads/allimg/2018082311/qdtnl3ajzuf.jpg",
//   },
//   {
//     id: "5",
//     modality: "CT",
//     patient_name: "123",
//     created_at: new Date(),
//     desc: "",
//     patient_id: "1_1",
//     institution_name: "hhh",
//     study_date: "2019-01-01",
//     thumbnail: "",
//   },
//   {
//     id: "6",
//     modality: "AAA",
//     patient_name: "456",
//     created_at: new Date(),
//     desc: "hhhhh",
//     patient_id: "1_2",
//     institution_name: "sssss",
//     study_date: "2019-11-23",
//     thumbnail: "http://m.imeitou.com/uploads/allimg/2018082311/qdtnl3ajzuf.jpg",
//   },
//   {
//     id: "7",
//     modality: "AAA1",
//     patient_name: "456",
//     created_at: new Date(),
//     desc: "hhhhh",
//     patient_id: "1_3",
//     institution_name: "sssss",
//     study_date: "2019-11-23",
//     thumbnail: "http://m.imeitou.com/uploads/allimg/2018082311/qdtnl3ajzuf.jpg",
//   },
// ] as ExamIndexListI[];
