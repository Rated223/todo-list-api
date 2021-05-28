import { RequestHandler } from 'express';
import { Company } from '../../models';

export interface SingnupBody {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  company: {
    name: string;
    email: string;
    phone?: string;
    web?: string;
  };
}

const signup: RequestHandler = async (req, res) => {
  const body = req.body as SingnupBody;
  const { company } = body;

  try {
    await Company.create(
      {
        name: company.name,
        email: company.email,
        phone: company.phone || null,
        web: company.web || null,
        users: [
          {
            role: 'ADMIN',
            firstName: body.firstName,
            lastName: body.lastName,
            username: body.username,
            email: body.email,
            password: body.password,
          },
        ],
      },
      {
        include: [Company.associations.Users],
      }
    );

    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send({ success: false, message: 'invalid data.' });
  }
};

export default signup;
