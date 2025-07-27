# Popular Courses System

## Overview

The popular courses system automatically determines and displays the 4 most popular courses on the landing page based on real user engagement metrics. This replaces the previous hardcoded "IMAGES" section with dynamic, data-driven content.

## How It Works

### Popularity Score Calculation

The system calculates a popularity score for each course using the following formula:

```
Popularity Score = (Enrollment Count × 1) + (Completion Count × 2) + (Recent Activity × 1.5)
```

Where:
- **Enrollment Count**: Number of users who have enrolled in the course (excluding cancelled enrollments)
- **Completion Count**: Number of users who have completed the course (weighted 2x higher)
- **Recent Activity**: Number of users who accessed the course in the last 30 days (weighted 1.5x)

### Why These Metrics?

1. **Enrollment Count**: Shows initial interest and demand
2. **Completion Count** (weighted higher): Indicates course quality and user satisfaction
3. **Recent Activity** (weighted): Shows current engagement and relevance

## Implementation Details

### Backend (HomeController)

```php
// Fetches courses with engagement metrics
$popularCourses = Course::published()
    ->withCount(['userProgress as enrollment_count' => function ($query) {
        $query->where('status', '!=', 'cancelled');
    }])
    ->withCount(['userProgress as completion_count' => function ($query) {
        $query->where('status', 'completed');
    }])
    ->withCount(['userProgress as recent_activity' => function ($query) {
        $query->where('last_accessed_at', '>=', now()->subDays(30));
    }])
    ->get()
    ->map(function ($course) {
        // Calculate popularity score
        $enrollmentScore = $course->enrollment_count * 1;
        $completionScore = $course->completion_count * 2;
        $recentActivityScore = $course->recent_activity * 1.5;
        
        $popularityScore = $enrollmentScore + $completionScore + $recentActivityScore;
        
        return [
            // Course data with metrics
            'enrollment_count' => $course->enrollment_count,
            'completion_count' => $course->completion_count,
            'recent_activity' => $course->recent_activity,
            'popularity_score' => $popularityScore,
            'completion_rate' => $course->enrollment_count > 0 
                ? round(($course->completion_count / $course->enrollment_count) * 100, 1)
                : 0,
        ];
    })
    ->sortByDesc('popularity_score')
    ->take(4)
    ->values();
```

### Frontend (Home.jsx)

The landing page now displays:
- Course title and description
- Difficulty level and duration
- Real-time engagement metrics (enrollments, completions, success rate)
- Course tags/features
- Direct link to view the course

## Monitoring and Debugging

### Artisan Command

Use the `courses:popular` command to view current popular courses and their metrics:

```bash
php artisan courses:popular
# Show top 4 courses (default)

php artisan courses:popular --limit=10
# Show top 10 courses
```

### Testing

Run the test suite to verify the system works correctly:

```bash
php artisan test --filter=HomeControllerTest
```

## Benefits

1. **Data-Driven**: Shows courses based on actual user behavior, not assumptions
2. **Dynamic**: Automatically updates as user engagement changes
3. **Transparent**: Users can see real metrics (enrollment count, completion rate)
4. **Motivational**: High-performing courses get more visibility
5. **Quality Indicator**: Completion rates help users choose quality courses

## Future Enhancements

Potential improvements to consider:

1. **Time-based weighting**: Give more weight to recent enrollments/completions
2. **User feedback integration**: Include ratings and reviews in popularity calculation
3. **Category-based popularity**: Show most popular courses by category
4. **Personalization**: Show different popular courses based on user preferences
5. **A/B testing**: Test different popularity algorithms

## Migration from Hardcoded Content

The system replaces the previous hardcoded "IMAGES" section that showed:
- TRANSFERRING A PATIENT
- CHILDBIRTH  
- INTUBATION
- ORTHO - RANGE OF MOTION

These were replaced with actual courses from the database, ranked by real user engagement metrics. 