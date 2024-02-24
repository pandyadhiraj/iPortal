import mongoose from "mongoose";

const CompIntern = new mongoose.Schema(
	{
		stu_id: { type: String, required: true },
		stuname: { type: String, required: true},
		stufname: { type: String, required: true},
		stulname: { type: String, required: true},	
		email: { type: String, required: true },
		stuname: { type: String, required: true },
		provider: { type: String, required: true },
		fromduration: { type: String, required: true },
		toduration: { type: String, required: true },
        whatfor: { type: String, required: true },
		domain: { type: String, required: true },
		quote: { type: String },
	},
	{ collection: 'completed-internships-data' }
)

export default mongoose.model('CompInternData', CompIntern);