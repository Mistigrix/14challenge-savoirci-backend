<script setup>
const teamMembers = [
  { name: 'Bath Dorgeles', role: 'Chef de projet & Front' },
  { name: 'Oclin Marcel C.', role: 'Dev Front-end' },
  { name: 'Rayane Irie', role: 'Back-end (Express)' }
]

const techStack = ['Vue.js', 'Node.js', 'Express']

/** Génère les initiales à partir du nom complet */
function getInitials(name) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('')
}
</script>

<template>
  <div class="about container">
    <!-- En-tête -->
    <div class="about__header">
      <div>
        <p class="about__badge">A propos</p>
        <h2 class="about__title">
          Savoir<span class="about__title-accent">CI</span>
        </h2>
        <!-- Mini drapeau ivoirien -->
        <div class="about__flag">
          <div class="about__flag-stripe about__flag-stripe--orange" />
          <div class="about__flag-stripe about__flag-stripe--white" />
          <div class="about__flag-stripe about__flag-stripe--green" />
        </div>
      </div>
      <div>
        <p class="about__text">
          Jour 4 du Challenge 14-14-14. SavoirCI est un quiz interactif multi-catégories
          qui mêle culture ivoirienne, technologie, géographie africaine et sciences.
        </p>
        <p class="about__text">
          Le design s'inspire du style éditorial / magazine : typographie serif forte
          (Playfair Display), layouts asymétriques, espaces généreux, accents colorés CI.
        </p>
      </div>
    </div>

    <!-- Équipe -->
    <div class="about__team">
      <div
        v-for="member in teamMembers"
        :key="member.name"
        class="about__member"
      >
        <div class="about__member-avatar">{{ getInitials(member.name) }}</div>
        <p class="about__member-name">{{ member.name }}</p>
        <p class="about__member-role">{{ member.role }}</p>
      </div>
    </div>

    <!-- Stack technique -->
    <div class="about__tech">
      <div v-for="tech in techStack" :key="tech" class="about__tech-item">
        <p class="about__tech-name">{{ tech }}</p>
      </div>
    </div>

    <!-- Footer section -->
    <div class="about__footer">
      <p class="about__footer-text">
        Open Source sur <span class="about__link--orange">225os.com</span> &amp;
        <span class="about__link--green">GitHub</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.about {
  padding-top: 48px;
  padding-bottom: 48px;
}

/* En-tête */
.about__header {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 40px;
  margin-bottom: 40px;
}

.about__badge {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: var(--color-orange);
  font-weight: 700;
  font-family: var(--font-sans);
  margin-bottom: 16px;
}

.about__title {
  font-size: 40px;
  font-weight: 800;
  font-family: var(--font-serif);
  color: var(--text-primary);
  margin-bottom: 20px;
  line-height: 1.1;
  letter-spacing: -1px;
}

.about__title-accent {
  color: var(--color-orange);
}

.about__flag {
  display: flex;
  width: 48px;
  height: 30px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.about__flag-stripe {
  flex: 1;
}

.about__flag-stripe--orange { background: var(--color-orange); }
.about__flag-stripe--white { background: #fff; }
.about__flag-stripe--green { background: var(--color-green); }

.about__text {
  font-size: 16px;
  line-height: 1.9;
  color: var(--text-secondary);
  margin-bottom: 16px;
  font-family: var(--font-sans);
}

.about__text:last-child {
  margin-bottom: 0;
}

/* Équipe */
.about__team {
  border-top: 1px solid var(--border-color);
  padding-top: 32px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1px;
  background: var(--border-color);
  margin-bottom: 32px;
}

.about__member {
  background: var(--bg-card);
  padding: 24px 20px;
}

.about__member-avatar {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-orange), var(--color-green));
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  font-family: var(--font-sans);
  margin-bottom: 12px;
}

.about__member-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
  font-family: var(--font-sans);
}

.about__member-role {
  font-size: 12px;
  color: var(--text-secondary);
  font-family: var(--font-sans);
}

/* Stack technique */
.about__tech {
  display: flex;
  gap: 1px;
  background: var(--border-color);
  margin-bottom: 32px;
}

.about__tech-item {
  flex: 1;
  background: var(--bg-card);
  padding: 16px 20px;
  text-align: center;
}

.about__tech-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  font-family: var(--font-sans);
}

/* Footer */
.about__footer {
  text-align: center;
  padding-top: 24px;
}

.about__footer-text {
  font-size: 12px;
  color: var(--text-secondary);
  font-family: var(--font-sans);
}

.about__link--orange {
  color: var(--color-orange);
  font-weight: 600;
}

.about__link--green {
  color: var(--color-green);
  font-weight: 600;
}

/* ---- Responsive tablette ---- */
@media (max-width: 992px) {
  .about__header {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .about__title {
    font-size: 32px;
  }
}

/* ---- Responsive mobile ---- */
@media (max-width: 576px) {
  .about {
    padding-top: 32px;
  }

  .about__team {
    grid-template-columns: 1fr;
  }

  .about__tech {
    flex-direction: column;
  }

  .about__text {
    font-size: 14px;
    line-height: 1.7;
  }
}
</style>
