import { RequestHandler } from 'express';
import jwt, { Algorithm } from 'jsonwebtoken';
import { Op } from 'sequelize';
import { User } from '../../models';

export interface LoginBody {
  username: string;
  password: string;
}

const login: RequestHandler = async (req, res) => {
  const { username, password } = req.body as LoginBody,
    secretKey = process.env.CONN_KEY || 'secret',
    algorithm = (process.env.CONN_ALGORITHM as Algorithm) || 'RS256';

  try {
    const user = await User.findOne({
      where: {
        [Op.or]: {
          username,
          email: username,
        },
      },
      include: [User.associations.Company],
    });

    if (user === null || !(await user.validPassword(password))) {
      res
        .status(404)
        .send({ success: false, message: 'Invalid username or password.' });
    } else {
      const token = jwt.sign({ userId: user.id }, secretKey, { algorithm });
      res.status(200).send({
        success: true,
        data: { user: { ...user.get(), password: undefined }, token },
      });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: 'Invalid data.' });
  }
};

export default login;
