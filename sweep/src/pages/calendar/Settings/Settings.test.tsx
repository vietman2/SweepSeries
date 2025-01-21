import { fireEvent, waitFor } from '@testing-library/react-native';

import { Settings } from './Settings';
import * as CalendarContext from '@contexts/calendar';
import * as CalendarsAPI from '@services/calendar/calendars';
import { sampleCalendars } from '@testdata/calendar';
import { renderWithProviders } from '@utils/test-utils';

jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
  },
  useLocalSearchParams: jest.fn(() => ({ calendarId: '1' })),
}));
jest.mock('@gorhom/bottom-sheet', () => {
  return {
    __esModule: true,
    default: 'BottomSheet',
    BottomSheetBackdrop: () => 'BottomSheetBackdrop',
    BottomSheetBackdropProps: null,
    BottomSheetView: ({ children }: { children: React.ReactNode }) => children,
  };
});
jest.mock('@contexts/calendar', () => ({
  CalendarProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useCalendar: jest.fn(),
}));
jest.mock('@fragments/Calendar', () => ({
  CalendarMembers: () => 'CalendarMembers',
  CalendarOptions: () => 'CalendarOptions',
}));

describe('<Settings />', () => {
  beforeEach(() => {
    jest.spyOn(CalendarContext, 'useCalendar').mockReturnValue({
      calendars: sampleCalendars,
      selectedCalendar: sampleCalendars[0],
      setSelectedCalendar: jest.fn(),
      reloadData: jest.fn(),
    });
  });

  it('handles switch alarms off and delete', async () => {
    jest
      .spyOn(CalendarsAPI, 'toggleCalendarNotification')
      .mockResolvedValue(true);
    jest.spyOn(CalendarsAPI, 'toggleCalendarDaily').mockResolvedValueOnce(true);
    jest.spyOn(CalendarsAPI, 'deleteCalendar').mockResolvedValueOnce(true);
    const { getAllByTestId, getByTestId, getByText } = renderWithProviders(
      <Settings />
    );

    await waitFor(() => {
      expect(getByText('오늘 알림 받기\n\n(09:00)')).toBeTruthy();
    });

    await waitFor(() => {
      fireEvent.press(getAllByTestId('toggle')[1]); // 오늘 알림 끄기
      fireEvent.press(getAllByTestId('toggle')[0]); // 알림 끄기
      fireEvent.press(getByTestId('캘린더 삭제하기')); // 캘린더 삭제
    });

    jest
      .spyOn(CalendarsAPI, 'toggleCalendarNotification')
      .mockResolvedValue(null);
    jest.spyOn(CalendarsAPI, 'toggleCalendarDaily').mockResolvedValueOnce(null);
    jest.spyOn(CalendarsAPI, 'deleteCalendar').mockResolvedValueOnce(null);

    await waitFor(() => {
      fireEvent.press(getAllByTestId('toggle')[1]); // 오늘 알림 끄기
      fireEvent.press(getAllByTestId('toggle')[0]); // 알림 끄기
      fireEvent.press(getByTestId('캘린더 삭제하기')); // 캘린더 삭제
    });
  });

  it('handles daily alarms', async () => {
    jest.spyOn(CalendarContext, 'useCalendar').mockReturnValue({
      calendars: sampleCalendars,
      selectedCalendar: {
        ...sampleCalendars[0],
        notifications_today: false,
        is_owner: false,
      },
      setSelectedCalendar: jest.fn(),
      reloadData: jest.fn(),
    });
    jest.spyOn(CalendarsAPI, 'toggleCalendarDaily').mockResolvedValueOnce(true);
    const { getAllByTestId, getByTestId } = renderWithProviders(<Settings />);

    await waitFor(() => {
      fireEvent.press(getAllByTestId('toggle')[1]); // 오늘 알림 켜기 스위치
      fireEvent.press(getByTestId('change-datetime'));
      fireEvent.press(getByTestId('cancel')); // DateTimePicker 취소
      fireEvent.press(getByTestId('취소'));
      fireEvent.press(getByTestId('확인')); // 요청
    });

    jest.spyOn(CalendarsAPI, 'toggleCalendarDaily').mockResolvedValueOnce(null);

    await waitFor(() => {
      fireEvent.press(getByTestId('확인')); // 요청
      fireEvent.press(getByTestId('close-modal'));
    });
  });

  it('handles daily toggle on', async () => {
    jest.spyOn(CalendarContext, 'useCalendar').mockReturnValue({
      calendars: sampleCalendars,
      selectedCalendar: null,
      setSelectedCalendar: jest.fn(),
      reloadData: jest.fn(),
    });

    renderWithProviders(<Settings />);
  });
});
