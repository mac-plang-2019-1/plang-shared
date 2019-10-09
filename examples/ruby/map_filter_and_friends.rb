EventDate.future.limit(limit)
  .each.with_index
  .take_while { |date, index| index < min_events || date.start_time < time_limit }
  .map { |date, _| date }
  .slice_when { |date0, date1| date0.event != date1.event }
  .map { |dates| [dates.first.event, dates] }
