# frozen_string_literal: true

module Clusters
  module Aws
    class AuthorizeRoleService
      attr_reader :user

      Response = Struct.new(:status, :body)

      ERRORS = [
        ActiveRecord::RecordInvalid,
        ActiveRecord::RecordNotFound,
        Clusters::Aws::FetchCredentialsService::MissingRoleError,
        ::Aws::Errors::MissingCredentialsError,
        ::Aws::STS::Errors::ServiceError
      ].freeze

      def initialize(user, params:)
        @user = user
        @params = params
      end

      def execute
        ensure_role_exists!
        update_role_arn!

        Response.new(:ok, credentials)
      rescue *ERRORS => e
        Gitlab::ErrorTracking.track_exception(e)

        Response.new(:unprocessable_entity, {})
      end

      private

      attr_reader :role, :params

      def ensure_role_exists!
        @role = ::Aws::Role.find_by_user_id!(user.id)
      end

      def update_role_arn!
        role.update!(params)
      end

      def credentials
        Clusters::Aws::FetchCredentialsService.new(role).execute
      end
    end
  end
end
