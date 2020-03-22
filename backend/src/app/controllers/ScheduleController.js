import {startOfDay, endOfDay, parseISO} from 'date-fns';
import {Op} from 'sequelize';
import Appointment from '../models/Appointment';
import User from '../models/User';

class ScheduleControlle{
  async index(req,res){

    const isProvider = await User.findOne({where:{
      id: req.userId,
      provider: true,
    }});

    if (!isProvider){
      return res.status(401).json({
        error: 'User is not a provider'
      })
    }

    let {date} = req.query;

    if(!date){
      date = new Date();
    }

    const parsedDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date:{
          [Op.between]: [
            startOfDay(parsedDate),
            endOfDay(parsedDate),
          ]
        },
      },
      order:['date'],
      attributes: ['id','date','user_id']
    })
    
    return res.json(appointments);
  }
}

export default new ScheduleControlle();