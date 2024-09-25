import { mockMonthlyWagesUseCase } from '__mocks__/MonthlyWages';
import MonthlyWagesHandler from 'modules/monthly-wages/http/handler';

const budgetsHandler = new MonthlyWagesHandler(mockMonthlyWagesUseCase);
