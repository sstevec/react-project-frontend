# **GymSync: A Community-Driven Approach to Fitness Engagement**

# **Team Information**

Chang Su, 1004829821, [cs.su@mail.utoronto.ca](mailto:cs.su@mail.utoronto.ca)  
Zihan Zhu, 1011844943, liz.zhu@mail.utoronto.ca

# **Motivation**

## **Identifying the Problem**

Many individuals struggle to maintain a consistent fitness routine due to a lack of motivation, accountability, and meaningful tracking. Traditional fitness apps focus on numbers but fail to engage users emotionally or socially. GymSync was developed to bridge this gap by fostering a community-driven approach to fitness tracking and engagement.

## **Why GymSync?**

GymSync combines fitness tracking, gamification, and social interaction into one platform. Our goal is to make fitness fun, competitive, and community-driven, ensuring users stay engaged and motivated in the long term.

## **Value Proposition**

1. Sustained Motivation – Compete with friends, earn badges, and set milestones.
2. Accountability Through Community – Share progress, seek motivation, and celebrate achievements.
3. All-in-One Fitness Solution – Track calories, log activities, and participate in challenges.
4. Encouraging Healthy Habits – Monthly challenges promote long-term wellness.

## **Objectives**

The primary goal of **GymSync** is to develop a comprehensive fitness tracking web application that empowers users to:

* **Track calorie intake and expenditure** to support a healthier lifestyle.

* **Engage with a fitness-focused community** through social interaction and shared progress.

* **Participate in challenges and competitions** to stay motivated and accountable.

* **Experience a seamless interface and performance**, combining an intuitive user interface with a robust and efficient backend system.

## **Technical Stack**

GymSync is developed as a modern web application with a clearly separated frontend and backend architecture. The technologies used for each component are as follows:

* **Backend**: Built with **Express.js**, utilizing **PostgreSQL** as the relational database and **Prisma ORM** for efficient and type-safe database access.

* **Frontend**: Developed using **Next.js**, styled with **Tailwind CSS v4**, and enhanced with components from **shadcn/ui** for a responsive and polished user interface.

* **Authentication**: Implements **JWT-based authentication** to ensure secure and stateless user sessions across the application.

* **Cloud Storage**: Integrates **Cloudinary** to handle user-uploaded media such as profile pictures and post images efficiently.

## **Features**

**GymSync** offers a rich set of features designed to promote healthy habits, social engagement, and long-term fitness motivation. The application meets all core technical requirements and fulfills the project objectives through the following key functionalities:

* **User Authentication & Authorization**  
  Secure login and registration are implemented using **JWT-based authentication**, ensuring only authorized users can access and manage their personal data. This satisfies the course’s **advanced feature** requirement and supports the objective of delivering a secure fitness platform.

* **Calorie Tracking System**  
  Users can **log food intake and exercise activities**, enabling daily monitoring of calorie balance. Entries are stored in a **PostgreSQL database** using **Prisma ORM**, fulfilling the **data storage requirement** while supporting the app’s goal of promoting healthier lifestyles through consistent tracking.

* **Friend Status & Social Motivation**  
  The platform includes a **friend system** that allows users to view summarized calorie stats of their friends. This feature is designed to **encourage mutual accountability and motivation**, aligning directly with the project's community-oriented objective.

* **Community Engagement**  
  Users can create and interact with **posts** to share fitness updates, photos, and progress. This encourages **social connection** and **community support**, fostering a positive fitness culture and fulfilling both the **frontend** and **cloud storage** requirements via media uploads handled by **Cloudinary**.

* **Competition System**  
  Users can **create and join fitness challenges**, competing based on calorie tracking or fitness goals. This gamified feature enhances user engagement and helps maintain long-term motivation—fulfilling the **advanced project requirement** for **stateful, user-driven features**.

* **Cloud Storage Integration**  
  All user-generated images (e.g., profile pictures, post images, competition banners) are stored securely via **Cloudinary**, ensuring scalability and meeting the course’s **file handling requirement**.

* **Responsive Frontend Design**  
  The UI is built using **Next.js 13+ with the App Router**, **Tailwind CSS v4**, and **shadcn/ui**. It supports **server-side rendering**, **API routes**, and **responsive layouts**, fully satisfying the **frontend architecture and styling requirements** outlined by the course.

---

# **🏋️‍♂️ GymSync User Manual**

## **🚀 Getting Started**

### **1\. Create an Account**

* Go to the GymSync website.
* Click on Sign Up.
* Enter your name, email, password
* Confirm your personal information to ensure the correct calorie calculation
    * Date of Birth
    * Gender: M/F
    * Body Weight (kg)
    * Height (cm)

### **2\. Log In**

* Use your email and password.
* Upon login, you’ll be directed to your Dashboard.

## **🧭 Navigation Guide**

### **🏠 Dashboard**

* View your calorie stats, recent activities, nutrition bar, step counter and water intake.
* Quick log options for food and workouts.


### **🍎 Meal Tracker**

* Manually log meals
    * Click on the ➕ → Select Meal Name (e.g. Breakfast, Lunch and Dinner)
        * Add Item by nutrition information and quantity if needed
        * Clicking on the \+  Add Food Item → Select/Enter food name
    * Update the meal by selecting the card
* Track calories, meal types, and nutrition.


### **💡 Status Ring**

* Display Food, Exercise and Remaining calories.
    * The calculation is Base Calories \- Food \+ Exercise \= Remaining
    * Base calories are personalized based on the following formulas.
        * For Men: BMR \= (10 × weight in kg) \+ (6.25 × height in cm) \- (5 × age in years) \+ 5
        * For Women: BMR \= (10 × weight in kg) \+ (6.25 × height in cm) \- (5 × age in years) \- 161
        * *Example*:
            * 30-year-old man, 80kg, 180cm: (10 × 80\) \+ (6.25 × 180\) \- (5 × 30\) \+ 5 \= 800 \+ 1,125 \- 150 \+ 5 \= ***1,780 kcal/day***
            * 30-year-old woman, 65kg, 165cm: (10 × 65\) \+ (6.25 × 165\) \- (5 × 30\) \- 161 \= 650 \+ 1,031 \- 150 \- 161 \= ***1,370 kcal/day***


### **🥦Nutrition Progress**

* Automatically generated from the Meal Tracker.
* Example: Carbohydrate at 10% (30g/300g) shows mostly empty bars.


### **📈Historical Line Chart**

* Tracking **Intake**, **Exercise** and **Remaining** calories in **Week/Month/Yea**r setting.


### **💧Water**

* Click the ![][image1] icon to add water intake for the day.
    * Example: If you drink two glasses of water today, click twice and it will show “**So far 2/8**”.



### **👣Septs**

* Add the number of steps of the day


### **🏋️ Exercise Tracker**

* Manually add workouts.
    * Click on the ➕ → Choose Exercise Type (e.g. Walking, Swimming and Yoga) and Intensity (e.g. Light, Moderate and Vigorous).
    * Input workout duration in minutes.
    * Active calories will be auto-generated.
    * Met Value can be adjusted under the advanced option.
* Track calories, duration, and optional details.


### **🙋‍♀️ Friends**

* Add friends using email or username.
* Accept/decline friend requests.
* View friend’s Dashboard, posts and current active competitions.


### **👥 Community**

* Post fitness updates, and share photos.
* In the **Explore** section, there are global posts. In the Friend Zone, there are Friends Only posts and global posts


### **🎯 Competitions**

* Compete with friends or the public.
* Create or join challenges (e.g., most calories burned).
    * How to create a competition:
1. Click "**Create New Competition**" to open the form.
2. Fill the **Title, Description, Objective, Rank Method, Access** (Public/Friends Only)**, Duration and Cover Image** (Optional)
* View leaderboards and track your progress. Progress is computed automatically for all exercises matched with the competition objective. For instance, if the competition objective is Walking, then all exercise within competition period and categorized as Walking will be counted.


### **👤 Profile**

* Update bio and profile photo.
* Calendar Color Coding: Based on how many activity was done  on that day
    * Activity includes **Exercise \+ Food intake**, does not include entering new tracker records nor creating competitors
* See personal stats and milestones.
    * Weight/BMI/Muscle Mass Goal setting.
    * Enter current input to update.
    * The line chart will be updated accordingly.

## **🧩 Troubleshooting & FAQ**

### **Q: How do I reset my password?**

A: Use the "Forgot Password" link on the login screen.

### **Q: Can I delete my post or log?**

A: Yes. Go to the post/log and click "Delete" or "Edit".

### **Q: How do I join a competition?**

A: Visit the Competitions tab, browse public or invited challenges, and click "Join".

---

# **Development Guide**

## **Backend Setup**

### **🔧 1\. Environment Setup and Configuration**

#### **Install Prerequisites:**

* *Node.js (v22.9.0 recommended)*
* *PostgreSQL 15*
* *npm or yarn package manager*

#### **Clone the Repository:**

*git clone https://github.com/sstevec/react-project-api.git*

#### **Install Dependencies:**

*npm install*

#### **Create .env File: Add a .env file at the root of the backend folder**

*DATABASE\_URL=postgresql://user:password@localhost:5432/fitness\_app*  
*JWT\_SECRET=your\_jwt\_secret*  
*JWT\_EXPIRES\_IN="7d"*  
*CLOUDINARY\_CLOUD\_NAME=your\_cloud\_name*  
*CLOUDINARY\_API\_KEY=your\_api\_key*  
*CLOUDINARY\_API\_SECRET=your\_api\_secret*

### **🗃️ 2\. Database Initialization**

GymSync uses **PostgreSQL \+ Prisma**. The database is preloaded with food and exercise presets using scripts.

#### **Set up the Database: Create a new database named fitness\_app in PostgreSQL:**

*CREATE DATABASE fitness\_app;*

#### **Run Prisma Migrations: From the backend directory:**

*npx prisma generate*  
*npx prisma migrate dev \--name init*

#### **Seed the Database: Run the provided scripts to insert preset data:**

*node scripts/seedFoodTable.js*  
*node scripts/seedMetTable.js*

### **☁️ 3\. Cloud Storage Configuration (Cloudinary)**

GymSync uses **Cloudinary** to manage user-uploaded images.

#### **Create a Cloudinary Account:**

* Visit [https://cloudinary.com](https://cloudinary.com) and sign up.
* Navigate to the **Dashboard** and copy your:
    * Cloud name
    * API key
    * API secret

## **Frontend Setup**

#### **Clone the Repository:**

*git clone https://github.com/sstevec/react-project-frontend.git*

#### **Install Dependencies:**

*npm install*

#### **Create .env File:**

*NEXT\_PUBLIC\_BACKEND\_URL=http://localhost:8000*

## **Local Testing and Development Flow**

#### **Start Backend:**

*npm run dev*

#### **Start Frontend:**

*npm run dev*

---

# **Deployment Information**

The project is deployed on AWS, you can access the project through: [http://35.174.154.205/login](http://35.174.154.205/login)

---

# **Video Demo**

https://youtu.be/GQ20QX2Lam0?si=sBXerVEYLNeOhhrU

---

# **Individual Contributions**

***Liz Zhu***

#### **📊 Dashboard Page**

* Designed and implemented the interactive dashboard UI with React and Tailwind CSS
* Developed real-time calorie tracking with dynamic status rings
* Integrated nutrition progress bars

#### **🏆 Competition System**

* Engineered competition creation flow with challenge templates
* Implemented real-time leaderboards

#### **👤 Profile Page**

* Built user profile editor with photo upload capability
* Created historical data visualization
* Implemented historical posts

***Chang Su***  
####
🗄️ **Backend Architecture & Database Design**

* Designed and implemented the full **PostgreSQL database schema** with Prisma ORM
* Developed the complete **backend logic** using Express.js, following RESTful API principles
* Created database initialization scripts to preload preset food and exercise data

🔐 **Authentication System**

* Configured secure **JWT-based authentication** for both frontend and backend
* Implemented middleware for route protection and role-based access

👥 **Friend System**

* Developed the **friendship features** on the frontend, including:
    * Sending and accepting friend requests
    * Viewing friend lists
    * Inspecting friends' calorie tracking summaries

🌐 **Community & Post System**

* Implemented the **post system**, allowing users to share fitness updates
* Built the **Explore (public posts)** and **Friend Zone (friend-only posts)** views
* Integrated **image upload** and **access control** using Cloudinary and JWT validation




# 

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAcCAYAAABh2p9gAAACQ0lEQVR4XtWT30uTURjHveo6kAgv+y+6KbJMSOwiCrRAcLaGkOBNyVbbCt1Kihj5zpyzliiCZYlWZBPKH5uaeCEVBnnRjVde+75Tk/H0Pmc7Z885Z3t5pau+8OV9z3mf7+c85+ysquq/1PetXw10XBfxwIWHPqBzh1Jb4g48nRk94GME2s7TGiP7ShpX1Mf1xSgC0TgOT/Tli0DRYTz7Gmygu45vJEMMxoGNve0CeDPVzeYQ5hp4vQhD4zuHoc9H2iwjw2B5CvQOBvcpQ5I3GcxzILo+WgLenTIYiHY4+2P5Etalv2VjAkLPqH92bIUCr8VvFYA9HjAy4wKGnWK9XcMamF773KEB8ZdsfNS+z4u48dv9DwMlmO3htfc7nkRA1AkY6lxPq3RWFIb2DAQkWJ/dKc7RGgmIosCGXp8GRfvfxNi2VdjE6qcZlcdEoaGpOOtEhaqwst1RcWB8qXB5Edr6zK9Bihb/Jkch8EH6hXRmZWDOnVGZbyMQuHyKgSpBB/u7AOvUrCbzZwbMyShsj4XBf+U0BJvOQOjqWbh3uwX8YS90+S5CsLkW1o1O2HEDtL5OQm7uJVhfUuzJ36npd9jYOKIyJOUWRgTIje0dbaoMSdZcqTM3NjdX36kMSbn5YS3kZHP793GVIckixbHOFvbcUxapqT4qzlDNa8Kig+dPYG86ASdqjrEQhu1PwBdrrjsJf5KP2VjNa7LsbnbTQyLs6MJCzrIWR/Wgg9V8WamhSna1ZZQeTDHn+JXCC+4W9q/6C2rvReDCGHNGAAAAAElFTkSuQmCC>