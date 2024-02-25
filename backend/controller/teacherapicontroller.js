import Teacher from '../models/teacher.model.js'
import Request from '../models/request.model.js'
import Notif from '../models/notification.model.js'
import Student from '../models/student.model.js'
import CompIntern from '../models/compintern.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
// import PDFDocument from 'pdfkit'
import path from 'path'
import multer from 'multer'
// import fs from 'fs'

dotenv.config()

export async function teachersignup(req, res) {
  try {
    const requiredFields = [
      'firstname',
      'lastname',
      'gender',
      'department',
      'domain',
      'role',
      'dateofbirth',
      'email',
      'password',
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    // console.log(req.body)
    const userexists = await Teacher.findOne({
      email: req.body.Email,
    })
    if (userexists) {
      return res.json({ error: 'user already exists' })
    }
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (!err) {
        await Teacher.create({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          gender: req.body.gender,
          department: req.body.department,
          domain: req.body.domain,
          role: req.body.role,
          dateofbirth: req.body.dateofbirth,
          email: req.body.email,
          password: hashedPassword,
        })
        return res.json({ status: 'ok' })
      } else {
        console.log(err)
        return res.json({ error: 'bcrypt error occured' })
      }
    })
  } catch (error) {
    return res.status(500).send({ error: error.message })
  }
}

export async function teacherlogin(req, res) {
  try {
    const teacher = await Teacher.findOne({
      email: req.body.email,
    })

    if (!teacher) {
      return res.json({ error: 'account not found' })
    } else {
      const match = await bcrypt.compare(req.body.password, teacher.password)
      if (!match) {
        // passwords do not match!
        return res.json({ error: 'incorrect username or password' })
      } else {
        const token = jwt.sign(
          {
            id: teacher._id,
            role: "teacher",
            userdata: teacher,
          },
          process.env.JWT_KEY,
          { expiresIn: '24h' }
        )
        return res.cookie('token', token, { httpOnly:true, secure:true, sameSite:"none"}).status(200).send({
          status: 'ok, teacher logged in',
          user: 'teacher',
          token: token,
        })
      }
    }
  } catch (error) {
    return res.status(500).send({ error: error.message })
  }
}

export async function teachergetmyrequests(req, res) {
  try {
    if (req.role != 'teacher') {
      return res.status(500).send({ error: 'User is not a teacher' });
    } else {
      const tchr = [req.user.firstname, req.user.lastname].join(' ')
      const aprlstts = req.user.role == 'classteacher' ? 0 : 1

      if (aprlstts == 0) {
        var requests = await Request.find({
          classteacher: tchr,
          approvalstatus: aprlstts,
        })
      } else {
        var requests = await Request.find({
          hod: tchr,
          approvalstatus: aprlstts,
        })
      }

      if (!requests) return res.status(500).send({ error: "The teacher has no requests to approve" });

      return res.status(200).send({
        status: 'ok',
        requests: requests,
      })
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

export async function teacherapproverequest(req, res) {
  try {

    if (req.role != 'teacher') {
      return res.status(500).send({ error: 'User is not a teacher' });
    }

    const tchr = [req.user.firstname, req.user.lastname].join(' ')

    const aprlstts = req.user.role == 'classteacher' ? 0 : 1

    if (aprlstts == 0) {
      var requests = await Request.findOneAndUpdate(
        {
          _id: req.body.id,
          classteacher: tchr,
          approvalstatus: aprlstts,
        },
        { $inc: { approvalstatus: 1 } },
        { returnNewDocument: true }
      )
    } else {
      var requests = await Request.findOneAndUpdate(
        {
          _id: req.body.id,
          hod: tchr,
          approvalstatus: aprlstts,
        },
        { $inc: { approvalstatus: 1 } },
        { returnNewDocument: true }
      )
    }
    if (!requests)
      return res.status(500).send({ error: 'No request found to approve' })

    return res.status(200).send({
      status: 'ok, request approved',
    })
  } catch (error) {
    return res.status(500).send({ error: error.message })
  }
}

const uploads = multer({
  storage: multer.diskStorage({
    destination: path.join(process.cwd(), './media/uploads/'),  //changed path
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      cb(
        null,
        file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
      )
    },
  }),
})

export async function uploadSingle(req, res) {
  const handler = uploads.single('image')

  handler(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.status(200).json({ message: 'File uploaded successfully.' })
  })
}

export async function teachergetmynotifs(req, res) {
  try {
    if (req.role != 'teacher') {
      return res.status(500).send({ error: 'User is not a teacher' });
    }
    const mynotifsdata = await Notif.find({
      teacher_id: req.user._id,
    })
    return res.status(200).send(mynotifsdata)
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

export async function teacherpostnotif(req, res) {
  try {
    if (req.role != 'teacher') {
      return res.status(500).send({ error: 'User is not a teacher' });
    }
    await Notif.create({
      teacher_id: req.user._id,
      email: req.user.email,
      firstname: req.user.firstname,
      lastname: req.user.lastname,
      title: req.body.Title,
      info: req.body.Info,
      link: req.body.iLink,
    })
    return res.json({ status: 'ok' })
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

export async function teacherfetchstudents(req, res) {
  try {
    if (req.role != 'teacher') {
      return res.status(500).send({ error: 'User is not a teacher' });
    }
    if (!req.body.searchquery) {
      var students = await Student.find()
    } else {
      var students = await Student.find({
        stuname: req.body.searchquery,
      })
    }
    return res.status(200).send(students)
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

export async function teacherfetchastudent(req, res) {
  try {
    if (req.role != 'teacher') {
      return res.status(500).send({ error: 'User is not a teacher' });
    }

    var student = await Student.findOne({
      stuname: req.body.searchquery,
    })

    var interns = await CompIntern.find({
      stuname: req.body.searchquery,
    })

    return res.status(200).send({
      student,
      interns,
    })
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

export async function teacherdelmynotifs(req, res) {
  try {
    const mynotifdata = await Notif.deleteOne({
      teacher_id: req.user._id,
      _id: req.body._id,
    })
    return res.json(mynotifdata)
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}
