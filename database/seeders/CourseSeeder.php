<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CourseLesson;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $courses = [
            [
                'title' => 'Introduction to Nursing Simulation',
                'description' => 'A comprehensive introduction to the fundamentals of nursing simulation, covering basic concepts, equipment usage, and safety protocols. This course is designed for beginners with no prior simulation experience.',
                'slug' => 'introduction-to-nursing-simulation',
                'difficulty' => 'beginner',
                'duration_weeks' => 4,
                'time_commitment_hours' => 8,
                'language' => 'English',
                'learning_objectives' => json_encode([
                    'Understand the fundamentals of nursing simulation',
                    'Learn basic simulation equipment operation',
                    'Master safety protocols and procedures',
                    'Develop critical thinking skills through simulation scenarios'
                ]),
                'prerequisites' => 'No prior experience required. Basic computer literacy recommended.',
                'is_published' => true,
                'is_featured' => true,
                'order' => 1,
                'category' => 'nursing',
                'tags' => ['simulation', 'beginner', 'fundamentals', 'safety'],
                'lessons' => [
                    [
                        'title' => 'What is Nursing Simulation?',
                        'content' => 'This lesson introduces the concept of nursing simulation and its importance in healthcare education. We\'ll explore how simulation helps bridge the gap between theory and practice.',
                        'slug' => 'what-is-nursing-simulation',
                        'summary' => 'Introduction to nursing simulation concepts and benefits',
                        'duration_minutes' => 45,
                        'order' => 1,
                        'is_published' => true,
                    ],
                    [
                        'title' => 'Simulation Equipment Basics',
                        'content' => 'Learn about the essential equipment used in nursing simulation, including manikins, monitors, and medical devices. Hands-on practice with basic equipment operation.',
                        'slug' => 'simulation-equipment-basics',
                        'summary' => 'Overview of simulation equipment and basic operation',
                        'duration_minutes' => 60,
                        'order' => 2,
                        'is_published' => true,
                    ],
                    [
                        'title' => 'Safety Protocols and Procedures',
                        'content' => 'Safety is paramount in healthcare simulation. This lesson covers essential safety protocols, emergency procedures, and best practices for maintaining a safe learning environment.',
                        'slug' => 'safety-protocols-and-procedures',
                        'summary' => 'Essential safety protocols for simulation environments',
                        'duration_minutes' => 50,
                        'order' => 3,
                        'is_published' => true,
                    ],
                    [
                        'title' => 'Your First Simulation Scenario',
                        'content' => 'Put your knowledge into practice with your first simulation scenario. Learn how to approach patient care situations systematically and develop your clinical reasoning skills.',
                        'slug' => 'your-first-simulation-scenario',
                        'summary' => 'Hands-on practice with your first simulation scenario',
                        'duration_minutes' => 90,
                        'order' => 4,
                        'is_published' => true,
                    ],
                ]
            ],
            [
                'title' => 'Advanced Patient Assessment',
                'description' => 'Master comprehensive patient assessment techniques through simulation. Learn to conduct thorough physical examinations, interpret vital signs, and develop clinical judgment skills.',
                'slug' => 'advanced-patient-assessment',
                'difficulty' => 'intermediate',
                'duration_weeks' => 6,
                'time_commitment_hours' => 12,
                'language' => 'English',
                'learning_objectives' => json_encode([
                    'Master comprehensive patient assessment techniques',
                    'Learn to interpret vital signs and clinical data',
                    'Develop advanced clinical judgment skills',
                    'Practice communication with patients and families'
                ]),
                'prerequisites' => 'Completion of Introduction to Nursing Simulation or equivalent experience',
                'is_published' => true,
                'is_featured' => true,
                'order' => 2,
                'category' => 'nursing',
                'tags' => ['assessment', 'intermediate', 'clinical-skills', 'vital-signs'],
                'lessons' => [
                    [
                        'title' => 'Comprehensive Health History',
                        'content' => 'Learn to conduct thorough patient interviews and gather comprehensive health histories. Practice active listening and therapeutic communication techniques.',
                        'slug' => 'comprehensive-health-history',
                        'summary' => 'Techniques for conducting thorough patient interviews',
                        'duration_minutes' => 55,
                        'order' => 1,
                        'is_published' => true,
                    ],
                    [
                        'title' => 'Physical Examination Techniques',
                        'content' => 'Master systematic physical examination techniques including inspection, palpation, percussion, and auscultation. Practice on simulation manikins.',
                        'slug' => 'physical-examination-techniques',
                        'summary' => 'Systematic physical examination methods',
                        'duration_minutes' => 75,
                        'order' => 2,
                        'is_published' => true,
                    ],
                    [
                        'title' => 'Vital Signs Interpretation',
                        'content' => 'Learn to accurately measure and interpret vital signs including temperature, pulse, respiration, and blood pressure. Understand normal ranges and clinical significance.',
                        'slug' => 'vital-signs-interpretation',
                        'summary' => 'Measurement and interpretation of vital signs',
                        'duration_minutes' => 65,
                        'order' => 3,
                        'is_published' => true,
                    ],
                ]
            ],
            [
                'title' => 'Emergency Nursing Procedures',
                'description' => 'Develop critical emergency nursing skills through high-fidelity simulation scenarios. Learn to respond quickly and effectively to medical emergencies.',
                'slug' => 'emergency-nursing-procedures',
                'difficulty' => 'advanced',
                'duration_weeks' => 8,
                'time_commitment_hours' => 15,
                'language' => 'English',
                'learning_objectives' => json_encode([
                    'Master emergency response protocols',
                    'Develop critical thinking under pressure',
                    'Learn advanced life support techniques',
                    'Practice team coordination in emergencies'
                ]),
                'prerequisites' => 'Advanced Patient Assessment course or equivalent clinical experience',
                'is_published' => true,
                'is_featured' => false,
                'order' => 3,
                'category' => 'nursing',
                'tags' => ['emergency', 'advanced', 'critical-care', 'life-support'],
                'lessons' => [
                    [
                        'title' => 'Emergency Response Protocols',
                        'content' => 'Learn systematic approaches to emergency situations including ABC (Airway, Breathing, Circulation) assessment and rapid response protocols.',
                        'slug' => 'emergency-response-protocols',
                        'summary' => 'Systematic emergency response procedures',
                        'duration_minutes' => 80,
                        'order' => 1,
                        'is_published' => true,
                    ],
                    [
                        'title' => 'Cardiac Emergency Management',
                        'content' => 'Master cardiac emergency procedures including CPR, defibrillation, and cardiac monitoring. Practice with advanced simulation scenarios.',
                        'slug' => 'cardiac-emergency-management',
                        'summary' => 'Cardiac emergency procedures and protocols',
                        'duration_minutes' => 90,
                        'order' => 2,
                        'is_published' => true,
                    ],
                ]
            ],
            [
                'title' => 'Pediatric Nursing Simulation',
                'description' => 'Specialized course focusing on pediatric nursing care through age-appropriate simulation scenarios. Learn to care for children from infancy through adolescence.',
                'slug' => 'pediatric-nursing-simulation',
                'difficulty' => 'intermediate',
                'duration_weeks' => 5,
                'time_commitment_hours' => 10,
                'language' => 'English',
                'learning_objectives' => json_encode([
                    'Understand pediatric developmental stages',
                    'Learn age-appropriate assessment techniques',
                    'Master pediatric medication administration',
                    'Develop family-centered care approaches'
                ]),
                'prerequisites' => 'Introduction to Nursing Simulation course',
                'is_published' => true,
                'is_featured' => false,
                'order' => 4,
                'category' => 'nursing',
                'tags' => ['pediatric', 'intermediate', 'family-care', 'developmental-stages'],
                'lessons' => [
                    [
                        'title' => 'Pediatric Developmental Stages',
                        'content' => 'Understand child development and how it affects nursing care. Learn age-appropriate communication and assessment techniques.',
                        'slug' => 'pediatric-developmental-stages',
                        'summary' => 'Child development and age-appropriate care',
                        'duration_minutes' => 50,
                        'order' => 1,
                        'is_published' => true,
                    ],
                    [
                        'title' => 'Pediatric Assessment Techniques',
                        'content' => 'Learn specialized assessment techniques for children of different ages. Practice with pediatric simulation manikins.',
                        'slug' => 'pediatric-assessment-techniques',
                        'summary' => 'Specialized pediatric assessment methods',
                        'duration_minutes' => 70,
                        'order' => 2,
                        'is_published' => true,
                    ],
                ]
            ],
        ];

        foreach ($courses as $courseData) {
            $lessons = $courseData['lessons'];
            unset($courseData['lessons']);
            
            $course = Course::create($courseData);
            
            foreach ($lessons as $lessonData) {
                $course->lessons()->create($lessonData);
            }
        }
    }
}
