import { motion } from 'framer-motion';
import TransactionDot from './TransactionDot';

interface CalendarGridProps {
  currentDate: Date;
  transactionsByDate: Record<string, any[]>;
  onDayClick: (date: Date) => void;
}

export default function CalendarGrid({
  currentDate,
  transactionsByDate,
  onDayClick,
}: CalendarGridProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const calendarDays: (Date | null)[] = [];

  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day));
  }

  const isToday = (date: Date | null) => {
    if (!date) return false;
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const getTransactionColors = (date: Date | null) => {
    if (!date) return [];
    
    const dateKey = date.toISOString().split('T')[0];
    const dayTransactions = transactionsByDate[dateKey] || [];

    if (dayTransactions.length === 0) return [];

    const hasIncome = dayTransactions.some((t: any) => 
      t.transaction_type === 'topup' || t.transaction_type === 'income' || t.transaction_type === 'refund'
    );
    const hasExpense = dayTransactions.some((t: any) => 
      t.transaction_type === 'transfer' || t.transaction_type === 'payment' || 
      t.transaction_type === 'withdrawal' || t.transaction_type === 'purchase'
    );
    const hasUpcoming = dayTransactions.some((t: any) => 
      t.transaction_type === 'upcoming' || t.status === 'pending'
    );

    const colors: string[] = [];
    if (hasExpense) colors.push('red');
    if (hasIncome) colors.push('green');
    if (hasUpcoming && !hasExpense && !hasIncome) colors.push('yellow');

    return colors;
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((date, index) => {
          const colors = getTransactionColors(date);
          const dayIsToday = isToday(date);

          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
              onClick={() => date && onDayClick(date)}
              disabled={!date}
              className={`
                aspect-square p-2 rounded-lg border relative
                transition-all duration-200
                ${!date ? 'invisible' : ''}
                ${dayIsToday ? 'bg-violet-100 border-violet-400 ring-2 ring-violet-400' : 'border-gray-200'}
                ${date && colors.length > 0 ? 'hover:shadow-md hover:scale-105' : ''}
                ${date && colors.length === 0 ? 'hover:bg-gray-50' : ''}
                disabled:cursor-default cursor-pointer
              `}
            >
              {date && (
                <>
                  <span className={`
                    text-sm font-semibold
                    ${dayIsToday ? 'text-violet-700' : 'text-gray-900'}
                  `}>
                    {date.getDate()}
                  </span>
                  {colors.length > 0 && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
                      {colors.map((color, i) => (
                        <TransactionDot key={i} color={color as any} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
