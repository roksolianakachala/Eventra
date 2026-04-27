const { createClient } = require('@supabase/supabase-js'); 

/*
    Підключення до БД Supabase 
    1. cd backend 
    2. npm install @supabase/supabase-js dotenv
    3. Створити файл .env у backend/ та скопіювати туди URL та KEY з налаштувань Supabase проекту 

    АЛЬТЕРНАТИВНИЙ ВАРІАНТ: 
    Захардкодити URL та KEY безпосередньо у цьому файлі (НЕ РЕКОМЕНДУЄТЬСЯ) 
*/ 

require('dotenv').config(); 
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; 
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY; 
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 

if (!supabaseUrl || !supabaseKey || !supabaseServiceKey) { 
    throw new Error("Відсутні необхідні змінні оточення для підключення до Supabase");
} 

const supabase = createClient(supabaseUrl, supabaseServiceKey); 

module.exports = supabase; 