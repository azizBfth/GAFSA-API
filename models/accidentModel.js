const mongoose = require('mongoose')

const accidentSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter a  name"]
        },
        lang: {
            type: String,
            required: [true, "Please enter a message lang"]
        },
        nbr_jours_sans_accident: {
            type: Number,
            required: true,
           
        },
        nbr_jours_avec_accident: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true
    }
)


const Accident = mongoose.model('Accident', accidentSchema);

module.exports = Accident;