import Company from './Company';
import User from './User';

Company.associate({ User });
User.associate({ Company });

export { Company, User };
