import { Schema } from 'mongoose'

export interface User {
  email: string
  name: string
  google: {
    googleId: string
    hasMigratedGDrive?: boolean
  }
  courseCart: {
    cartContent: {
      studyProgram: string
      academicYear: string
      semester: string
      courseNo: string
      selectedSectionNo: string
      isHidden: boolean
      color?: string
    }[]
  }
}

// export const UserSchema = buildSchema(User)
export const UserSchema = new Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  google: {
    googleId: { type: String, required: true },
    hasMigratedGDrive: { type: Boolean },
  },
  courseCart: {
    cartContent: [
      {
        studyProgram: { type: String, required: true },
        academicYear: { type: String, required: true },
        semester: { type: String, required: true },
        courseNo: { type: String, required: true },
        selectedSectionNo: { type: String, required: true },
        isHidden: { type: Boolean, required: true, default: false },
        color: { type: String },
      },
    ],
  },
})
