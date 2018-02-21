def first_greater_than_max(max, array)
  array.each do |x|
    if x > max
      return x  # Returns from first_greater_than_max, not just the block
    end
  end
  nil
end

puts first_greater_than_max(50, [3, 4, 7, 11, 18, 29, 47, 76, 123, 199, 322])
