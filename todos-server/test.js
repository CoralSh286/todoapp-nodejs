import bcrypt from 'bcrypt';

const newHash = await bcrypt.hash('121245', 10);
console.log(newHash); // זה יהיה ההאש החדש שלך