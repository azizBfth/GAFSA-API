const mongoose = require('mongoose')

const accidentSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter a  name"]
        },
        message: {
            type: String,
            required: [true, "Please enter a  Message"]
        },
        lang: {
            type: String,
            required: [true, "Please enter a message lang"]
        },
        nbr_jours_sans_accident: {
            type: Number,
            required: true,
           
        },
        nbr_totale_accidents: {
            type: Number,
            required: true,
        },
        temperature: {
            type: Number,
            default: 18
          }
    },
    {
        timestamps: true
    }
)


const Accident = mongoose.model('Accident', accidentSchema);

module.exports = Accident;