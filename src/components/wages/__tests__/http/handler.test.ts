import { mockWagesUseCase } from '__mocks__/Wages';
import WagesHandler from 'components/wages/http/handler';

const budgetsHandler = new WagesHandler(mockWagesUseCase);
