const Profile = require("../models/profile");

module.exports = function (router) {
  const route = router.route("/profile");

  /**
   * POST /api/profile
   *
   * Create a new profile for the user.
   * 
   * Request:
   *  {
   *   "politicalAffiliation": "Independent",
   *  }
   *
   * Response:
   *   {
   *     "message": "Successfuly created profile!",
   *     "data": {
   *       "email": "abadia2@illinois.edu",
   *       "politicalAffiliation": "Independent",
   *     },
   *   }
   */
  route.post(async function (req, res) {
    const firebaseUid = req?.firebaseUser?.uid;
    const email = req?.firebaseUser?.email;

    const newProfile = new Profile({
      firebaseUid: firebaseUid,
      email: email,
      politicalAffiliation: req?.body?.politicalAffiliation,
    });

    const validationError = newProfile.validateSync();

    if (validationError) {
      res.status(400).json({ 
        message: 'Failed to create profile!',
        error: validationError 
      });
      return;
    }

    try {
      const existingProfile = await Profile.findOne({ firebaseUid: firebaseUid });

      if (existingProfile) {
        res.status(400).json({ 
          message: 'Failed to create profile!',
          error: 'Profile already exists!',
          data: {
            email: existingProfile.email,
            politicalAffiliation: existingProfile.politicalAffiliation,
            survey: existingProfile?.survey,
          } 
        });
        return;
      }

      const savedProfile = await newProfile.save();
      res.status(200).json({ 
        message: 'Successfuly created profile!',
        data: {
          email: savedProfile.email,
          politicalAffiliation: savedProfile.politicalAffiliation,
          survey: existingProfile?.survey,
        } 
      });
    } catch (err) {
      res.status(500).json({ 
        message: 'Failed to create profile!',
        error: err 
      });
    }
  });

  /**
   * GET /api/profile
   *
   * Get the profile for the user.
   *
   * Response:
   *   {
   *     "message": "Successfuly retrieved profile!",
   *     "data": {
   *       "email": "abadia2@illinois.edu",
   *       "politicalAffiliation": "Independent",
   *     },
   *   }
   */
  route.get(async function (req, res) {
    const firebaseUid = req?.firebaseUser?.uid;

    try {
      const profile = await Profile.findOne({ firebaseUid: firebaseUid });
      res.status(200).json({ 
        message: 'Successfuly retrieved profile!',
        data: {
          email: profile.email,
          politicalAffiliation: profile.politicalAffiliation,
          survey: profile?.survey,
        } 
      });
    } catch (err) {
      res.status(404).json({ 
        message: 'Failed to retrieved profile!',
        error: err 
      });
    }
  });

  /**
   * PUT /api/profile
   *
   * Update the profile for the user.
   * 
   * Request:
   *   {
   *     "email": "abadia2@illinois.edu"
   *     "politicalAffiliation": "Independent",
   *   }
   *
   * Response:
   *   {
   *     "message": "Successfuly updated profile!",
   *     "data": {
   *       "email": "abadia2@illinois.edu",
   *       "politicalAffiliation": "Independent",
   *     },
   *   }
   */
  route.put(async function (req, res) {
    const firebaseUid = req?.firebaseUser?.uid;

    try {
      const filter = { firebaseUid: firebaseUid };
      const update = {};

      if (req.body.email) {
        update.email = req.body.email;
      }

      if (req.body.politicalAffiliation) {
        update.politicalAffiliation = req.body.politicalAffiliation;
      }

      if (req.body.survey) {
        for (const [key, value] of Object.entries(req.body.survey)) {
          update[`survey.${key}`] = value;
        }
      }

      const updatedProfile = await Profile.findOneAndUpdate(filter, update, { new: true });
      res.status(200).json({ 
        message: 'Successfuly updated profile!',
        data: {
          email: updatedProfile.email,
          politicalAffiliation: updatedProfile.politicalAffiliation,
          survey: updatedProfile?.survey,
        } 
      });
    } catch (err) {
      res.status(500).json({ 
        message: 'Failed to update profile!',
        error: err 
      });
    }
  });

  /**
   * DELETE /api/profile
   *
   * Delete the profile for the user.
   *
   * Response:
   *   {
   *     "message": "Successfuly updated profile!",
   *     "data": {
   *       "email": "abadia2@illinois.edu",
   *       "politicalAffiliation": "Independent",
   *     },
   *   }
   */
  route.delete(async function (req, res) {
    const firebaseUid = req?.firebaseUser?.uid;

    try {
      const filter = { firebaseUid: firebaseUid };
      const deletedProfile = await Profile.findOneAndDelete(filter);
      res.status(201).json({ 
        message: 'Successfuly deleted profile!',
        data: {
          email: deletedProfile.email,
          politicalAffiliation: deletedProfile.politicalAffiliation,
          survey: deletedProfile?.survey,
        } 
      });
    } catch (err) {
      res.status(500).json({ 
        message: 'Failed to delete profile!',
        error: err 
      });
    }    
  });

  return router;
};
